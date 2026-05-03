from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel
# from agents.orchestrator import process_scan
# from rag.database import HeritageDatabase
import google.generativeai as genai
import os
import httpx
import asyncio
from concurrent.futures import ThreadPoolExecutor

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"FastAPI application starting up on port {os.getenv('PORT', '8080')}...")
    
    # Debug: List available models
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            print("Available Gemini Models:")
            for m in genai.list_models():
                if "generateContent" in m.supported_generation_methods:
                    print(f" - {m.name}")
    except Exception as e:
        print(f"Could not list models: {e}")
        
    yield
    print("FastAPI application shutting down...")

app = FastAPI(title="Tareekh-ky-Jhonky RAG Backend", lifespan=lifespan)

# Add request logging middleware to debug incoming requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    print(f"Response: {response.status_code}")
    return response

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/place-photo")
async def get_place_photo(query: str):
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_MAPS_API_KEY not configured")
    
    refined_query = f"{query}, Pakistan"
    
    async with httpx.AsyncClient() as client:
        try:
            search_response = await client.post(
                "https://places.googleapis.com/v1/places:searchText",
                headers={
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": api_key,
                    "X-Goog-FieldMask": "places.photos,places.displayName",
                },
                json={"textQuery": refined_query}
            )
            
            if search_response.status_code != 200:
                raise HTTPException(status_code=search_response.status_code, detail="Failed to search for place")
                
            search_data = search_response.json()
            photos = search_data.get("places", [{}])[0].get("photos")
            
            if not photos:
                raise HTTPException(status_code=404, detail="No photos found")
                
            photo_name = photos[0]["name"]
            photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx=1000&maxWidthPx=1000&key={api_key}"
            return RedirectResponse(photo_url)
        except Exception as e:
             raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def list_models():
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not set"}
        genai.configure(api_key=api_key)
        models = []
        for m in genai.list_models():
            models.append({
                "name": m.name,
                "supported_methods": m.supported_generation_methods,
                "description": m.description
            })
        return {"models": models}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/diag")
async def diagnostic():
    return {
        "hasGeminiKey": bool(os.getenv("GEMINI_API_KEY")),
        "hasMapsKey": bool(os.getenv("GOOGLE_MAPS_API_KEY")),
        "env": os.getenv("NODE_ENV", "development"),
        "static_path": static_path if 'static_path' in globals() else "not_defined"
    }

class ScanRequest(BaseModel):
    image_base64: str
    mime_type: str = "image/jpeg"
    language: str = "english"

class TranslateRequest(BaseModel):
    story: str
    language: str

@app.post("/api/scan")
async def scan_heritage(request: ScanRequest):
    try:
        from agents.orchestrator import process_scan
        result = process_scan(
            request.image_base64,
            request.mime_type,
            request.language
        )
        return {"success": True, "data": result}
    except Exception as e:
        print(f"Scan error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_story(request: TranslateRequest):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        lang_prompts = {
            "Urdu": "Translate to traditional Urdu script (Persian-Arabic). Strictly FORBID Roman Urdu or Latin characters. Return only the translated text in traditional script.",
        }
        
        target = request.language
        if target not in lang_prompts:
            return {"success": True, "text": request.story}
        
        response = model.generate_content(f"{lang_prompts[target]}\n\n{request.story}")
        return {"success": True, "text": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_root():
    return {"status": "ok"}

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "TKJ RAG Backend"}

# After all API routes, serve the static frontend
# Use both relative and absolute search for static directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
possible_static_paths = [
    os.path.join(BASE_DIR, "static"),
    os.path.join(os.getcwd(), "static"),
    "/app/static"
]

static_path = None
for p in possible_static_paths:
    print(f"DEBUG: Checking for static at {p}")
    if os.path.exists(p) and os.path.isdir(p):
        static_path = p
        print(f"DEBUG: Found static directory at {static_path}")
        break

if not static_path:
    static_path = os.path.join(BASE_DIR, "static") # Fallback
    print(f"DEBUG: Static directory not found! Defaulting to {static_path}")

if os.path.exists(static_path):
    print(f"DEBUG: Contents of {static_path}: {os.listdir(static_path)}")
else:
    print(f"DEBUG: Static path {static_path} still does not exist.")


# Mount assets if they exist
assets_path = os.path.join(static_path, "assets")
if os.path.exists(assets_path):
    print(f"DEBUG: Mounting assets from {assets_path}")
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/")
async def root():
    index_file = os.path.join(static_path, "index.html")
    print(f"DEBUG: Root request. Looking for index at {index_file}")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    # Debug info if missing
    files = os.listdir(static_path) if os.path.exists(static_path) else "N/A"
    return {
        "error": "Frontend index.html not found",
        "static_path": static_path,
        "exists": os.path.exists(static_path),
        "contents": files,
        "cwd": os.getcwd(),
        "base_dir": BASE_DIR
    }

@app.get("/{rest_of_path:path}")
async def serve_static(rest_of_path: str):
    # Try serving the file directly from static directory
    file_path = os.path.join(static_path, rest_of_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # SPA fallback: Serve index.html for any other route (except API)
    if not rest_of_path.startswith("api/"):
        index_file = os.path.join(static_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    
    raise HTTPException(status_code=404, detail=f"Path {rest_of_path} not found")

if __name__ == "__main__":
    import uvicorn
    # Use the port from the environment variable if available
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
