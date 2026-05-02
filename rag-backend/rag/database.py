import chromadb
from chromadb.utils import embedding_functions
import json
import os

class HeritageDatabase:
    def __init__(self):
        # In a real environment, you'd use a persistent path. 
        # For this demo, we'll use an in-memory or local path.
        self.client = chromadb.PersistentClient(path="./chroma_db")
        
        # Use Google's embedding function
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Fallback for initialization if key is missing during build time
            # In production, this would throw an error
            print("Warning: GEMINI_API_KEY not found for embedding initialization")
            self.embedding_fn = None
        else:
            self.embedding_fn = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
                api_key=api_key,
                model_name="models/embedding-001"
            )
            
        self.collection = self.client.get_or_create_collection(
            name="pakistan_heritage",
            embedding_function=self.embedding_fn
        )
    
    def ingest_all(self):
        if not self.embedding_fn:
            return 0
            
        data_path = os.path.join(os.path.dirname(__file__), "data/heritage_data.json")
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        elements = data["heritage_elements"]
        
        documents = []
        metadatas = []
        ids = []
        
        for el in elements:
            # Create rich text for embedding
            doc = f"""
            {el['name_english']} ({el['name_urdu']})
            Type: {el['element_type']}
            Site: {el['site']}, {el['city']}, {el['province']}
            Era: {el['era']} | Culture: {el['culture']}
            Description: {el['description']}
            Significance: {el['historical_significance']}
            Visual: {el['visual_characteristics']}
            """
            documents.append(doc)
            metadatas.append({
                "id": el["id"],
                "name": el["name_english"],
                "site": el["site"],
                "era": el["era"],
                "element_type": el["element_type"],
                "province": el["province"]
            })
            ids.append(el["id"])
        
        if documents:
            self.collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
        return len(elements)
    
    def query(self, text: str, n_results: int = 3) -> list:
        if not self.embedding_fn:
            return {"documents": [[]]}
            
        results = self.collection.query(
            query_texts=[text],
            n_results=n_results
        )
        return results
