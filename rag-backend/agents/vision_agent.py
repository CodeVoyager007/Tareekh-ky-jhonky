import google.generativeai as genai
import json
import os

def analyze_image(image_base64: str, mime_type: str = "image/jpeg") -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    # Remove data:image/jpeg;base64, prefix if present
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]
        
    image_part = {
        "inline_data": {
            "mime_type": mime_type,
            "data": image_base64
        }
    }
    
    prompt = """
    You are a Pakistani heritage recognition expert specializing in Islamic art, 
    Mughal architecture, Sufi traditions, Indus Valley civilization, Gandhara art, 
    and regional folk traditions.
    
    Analyze this image and identify the heritage element.
    
    Return ONLY valid JSON, no markdown:
    {
      "element_type": "calligraphy|geometric_pattern|architectural_element|inscription|instrument|motif|artifact|unknown",
      "era": "specific period e.g. '3rd millennium BCE' or 'Mughal, 16th century'",
      "cultural_region": "Punjab|Sindh|KPK|Balochistan|cross-regional|unknown",
      "specific_name": "official name if identifiable",
      "confidence": "high|medium|low",
      "confidence_reason": "one sentence",
      "visual_features": "key visual features that led to identification",
      "search_terms": ["3-5 terms to search in heritage database"]
    }
    """
    
    response = model.generate_content([prompt, image_part])
    
    try:
        text = response.text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```json"):
                text = "\n".join(lines[1:-1])
            else:
                text = "\n".join(lines[1:-1])
        return json.loads(text)
    except Exception as e:
        return {"element_type": "unknown", "confidence": "low", "error": str(e), "raw": response.text}
