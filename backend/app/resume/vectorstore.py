import os
import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

# Configurable settings
PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIR")
EMBED_MODEL_NAME = os.getenv("EMBED_MODEL")

# Safe ChromaDB init with error handling
try:
    client = chromadb.Client(Settings(
        persist_directory=PERSIST_DIRECTORY,
        anonymized_telemetry=False
    ))
    embedding_function = SentenceTransformerEmbeddingFunction(model_name=EMBED_MODEL_NAME)
    collection = client.get_or_create_collection(name="resumes", embedding_function=embedding_function)
except Exception as e:
    raise RuntimeError(f"Failed to initialize ChromaDB: {str(e)}")


def add_resume_embedding(user_id, embedding, metadata):
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("Invalid user_id. Must be a positive integer.")

    if not isinstance(embedding, list) or not all(isinstance(x, float) for x in embedding):
        raise ValueError("Invalid embedding format. Must be a list of floats.")

    if not isinstance(metadata, dict):
        raise ValueError("Metadata must be a dictionary.")

    try:
        collection.add(
            ids=[str(user_id)],
            embeddings=[embedding],
            metadatas=[metadata],
            documents=[metadata.get("text", "")]
        )
    except Exception as e:
        raise RuntimeError(f"Failed to add resume embedding to ChromaDB: {str(e)}")


def query_similar_resumes(embedding, top_k=5):
    if not isinstance(embedding, list) or not all(isinstance(x, float) for x in embedding):
        raise ValueError("Embedding must be a list of floats.")

    if not isinstance(top_k, int) or top_k <= 0:
        raise ValueError("top_k must be a positive integer.")

    try:
        results = collection.query(
            query_embeddings=[embedding],
            n_results=top_k
        )
        return results
    except Exception as e:
        raise RuntimeError(f"Failed to query similar resumes: {str(e)}")
