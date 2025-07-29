import os
import fitz  # pymupdf

ALLOWED_EXTENSIONS = ('.pdf',)

def parse_resume(file_path):
    # Input validation
    if not isinstance(file_path, str) or not file_path.strip():
        raise ValueError("Invalid file path provided.")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    if not file_path.lower().endswith(ALLOWED_EXTENSIONS):
        raise ValueError("Unsupported file type. Only PDF files are allowed.")

    # Parsing PDF with PyMuPDF
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

        if not text.strip():
            raise ValueError("Parsed text is empty. Resume content could not be extracted.")
        
        return text
    except Exception as e:
        raise RuntimeError(f"Failed to parse resume: {str(e)}")
