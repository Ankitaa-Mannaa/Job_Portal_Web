import os
import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from app.resume.embedder import embed_text

EMBED_MODEL_NAME = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")  
embedding_function = SentenceTransformerEmbeddingFunction(model_name=EMBED_MODEL_NAME)

client = chromadb.Client(Settings(persist_directory=os.getenv("CHROMA_PERSIST_DIR")))
job_collection = client.get_or_create_collection(
    name="jobs",
    embedding_function=embedding_function
)
job_collection = client.get_or_create_collection(name="jobs", embedding_function=embedding_function)

def add_job_embedding(job_id, job_description):
    embedding = embed_text(job_description)
    job_collection.add(
        ids=[str(job_id)],
        embeddings=[embedding],
        metadatas=[{"description": job_description}],
        documents=[job_description]
    )

