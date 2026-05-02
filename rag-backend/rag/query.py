from .database import HeritageDatabase
import google.generativeai as genai
import os
import json

# Lazy initialization of DB
_db = None

def get_db():
    global _db
    if _db is None:
        _db = HeritageDatabase()
    return _db

def query_with_rag(vision_result: dict, language: str = "english") -> dict:
    db = get_db()
    
    # Build search query from vision result
    search_text = f"""
    {vision_result.get('specific_name', '')} 
    {vision_result.get('element_type', '')} 
    {vision_result.get('era', '')} 
    {vision_result.get('cultural_region', '')}
    """
    
    # Query vector DB
    rag_results = db.query(search_text, n_results=3)
    
    # Build context from RAG results
    context = ""
    if rag_results and rag_results['documents'] and rag_results['documents'][0]:
        context = "\n\n".join(rag_results['documents'][0])
    
    # Call Gemini with RAG context
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    lang_instruction = {
        "english": "Respond in clear factual English.",
        "urdu": "Respond in traditional Urdu script (Persian-Arabic script). Strictly FORBID Roman Urdu or Latin characters.",
    }.get(language.lower(), "Respond in clear factual English.")
    
    prompt = f"""
    You are a Pakistani heritage expert. Using the verified database context below, 
    provide accurate information about this heritage element.
    
    VISION ANALYSIS: {json.dumps(vision_result)}
    
    VERIFIED DATABASE CONTEXT:
    {context}
    
    RULES:
    - Prioritize information from the database context above Gemini's general knowledge
    - If context contains this element, use its exact historical facts
    - No dramatic storytelling, no invented dialogues
    - {lang_instruction}
    
    Return JSON ONLY:
    {{
      "element_type": "",
      "era": "",
      "cultural_region": "",
      "specific_name": "",
      "name_urdu": "",
      "site": "",
      "confidence": "high|medium|low",
      "confidence_reason": "",
      "story": "150-200 words, factual",
      "folk_legend": "documented only, or null",
      "sources": [],
      "from_database": true
    }}
    """
    
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Handle markdown blocks if any
    if response_text.startswith("```"):
        lines = response_text.splitlines()
        if lines[0].startswith("```json"):
            response_text = "\n".join(lines[1:-1])
        else:
            response_text = "\n".join(lines[1:-1])
            
    return json.loads(response_text)
