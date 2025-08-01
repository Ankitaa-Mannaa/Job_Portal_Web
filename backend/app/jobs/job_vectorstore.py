import os
import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from app.resume.embedder import embed_text

PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIR")
EMBED_MODEL_NAME = os.getenv("EMBED_MODEL")

try:
    client = chromadb.Client(Settings(
        persist_directory=PERSIST_DIRECTORY,
        anonymized_telemetry=False
    ))
    embedding_function = SentenceTransformerEmbeddingFunction(model_name=EMBED_MODEL_NAME)
    job_collection = client.get_or_create_collection(name="jobs", embedding_function=embedding_function)
except Exception as e:
    raise RuntimeError(f"Failed to initialize ChromaDB (jobs): {str(e)}")


def add_job_embedding(job_id, job_description):
    if not isinstance(job_description, str) or not job_description.strip():
        raise ValueError("Job description must be a non-empty string")

    embedding = embed_text(job_description)
    job_collection.add(
        ids=[str(job_id)],
        embeddings=[embedding],
        metadatas=[{"job_id": job_id, "description": job_description}],
        documents=[job_description]
    )


def query_similar_jobs(resume_embedding, top_k=5):
    if not isinstance(resume_embedding, list) or not all(isinstance(x, float) for x in resume_embedding):
        raise ValueError("Resume embedding must be a list of floats")
    try:
        results = job_collection.query(
            query_embeddings=[resume_embedding],
            n_results=top_k
        )
        return results
    except Exception as e:
        raise RuntimeError(f"Failed to query job vectors: {str(e)}")