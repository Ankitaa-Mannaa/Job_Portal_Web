job_collection = client.get_or_create_collection(name="jobs", embedding_function=embedding_function)

def add_job_embedding(job_id, job_description):
    embedding = embed_text(job_description)
    job_collection.add(
        ids=[str(job_id)],
        embeddings=[embedding],
        metadatas=[{"description": job_description}],
        documents=[job_description]
    )
