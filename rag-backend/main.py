from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel
from agents.orchestrator import process_scan
from rag.database import HeritageDatabase
import google.generativeai as genai
import os
import httpx

app = FastAPI(title="Tareekh-ky-Jhonky RAG Backend")

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

@app.get("/api/diag")
async def diagnostic():
    return {
        "hasGeminiKey": bool(os.getenv("GEMINI_API_KEY")),
        "hasMapsKey": bool(os.getenv("GOOGLE_MAPS_API_KEY")),
        "env": os.getenv("NODE_ENV", "development")
    }

# After all API routes, serve the static frontend

class ScanRequest(BaseModel):
    image_base64: str
    mime_type: str = "image/jpeg"
    language: str = "english"

class TranslateRequest(BaseModel):
    story: str
    language: str

@app.on_event("startup")
async def startup():
    # Pre-warm the database
    try:
        db = HeritageDatabase()
        count = db.ingest_all()
        print(f"Heritage database loaded: {count} elements")
    except Exception as e:
        print(f"Failed to initialize database: {e}")

@app.post("/api/scan")
async def scan_heritage(request: ScanRequest):
    try:
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
        model = genai.GenerativeModel("gemini-1.5-pro")
        
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

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "TKJ RAG Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

# After all API routes, serve the static frontend
# We check if the static directory exists (it will be created in Docker build)
static_path = os.path.join(os.getcwd(), "static")

@app.get("/{rest_of_path:path}")
async def serve_static(rest_of_path: str):
    # If it starts with api/, it's a 404 for API
    if rest_of_path.startswith("api/"):
         raise HTTPException(status_code=404)

    if rest_of_path == "" or rest_of_path == "/":
        index_file = os.path.join(static_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend not built yet. Run 'npm run build'"}
    
    file_path = os.path.join(static_path, rest_of_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # SPA fallback
    index_file = os.path.join(static_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    
    return {"message": f"Asset {rest_of_path} not found and frontend not available"}
