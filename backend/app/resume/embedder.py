from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_text(text):
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Invalid input: text must be a non-empty string.")

    try:
        embedding = model.encode(text)
        return embedding.tolist()
    except Exception as e:
        raise RuntimeError(f"Embedding failed: {str(e)}")
