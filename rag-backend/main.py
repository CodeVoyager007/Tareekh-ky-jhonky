from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.orchestrator import process_scan
from rag.database import HeritageDatabase
import google.generativeai as genai
import os

app = FastAPI(title="Tareekh-ky-Jhonky RAG Backend")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/scan")
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

@app.post("/translate")
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

@app.get("/health")
async def health():
    return {"status": "ok", "service": "TKJ RAG Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
