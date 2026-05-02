from .vision_agent import analyze_image
from rag.query import query_with_rag
import json

def process_scan(image_base64: str, mime_type: str, language: str = "english") -> dict:
    # Step 1: Vision Agent identifies element
    vision_result = analyze_image(image_base64, mime_type)
    
    # Step 2: RAG + History Agent enriches with verified data
    # We pass the identified vision info to the RAG pipeline
    enriched_result = query_with_rag(vision_result, language)
    
    # Step 3: Merge results
    # We prioritize enriched results but keep unique vision findings
    final = {**vision_result, **enriched_result}
    final["pipeline"] = "vision_agent → rag_query → gemini_enrichment"
    
    return final
