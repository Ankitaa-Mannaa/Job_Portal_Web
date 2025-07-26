import os
import textract

ALLOWED_EXTENSIONS = ('.pdf', '.docx', '.doc', '.txt')

def parse_resume(file_path):
    # Input validation
    if not isinstance(file_path, str) or not file_path.strip():
        raise ValueError("Invalid file path provided.")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    if not file_path.lower().endswith(ALLOWED_EXTENSIONS):
        raise ValueError("Unsupported file type. Only PDF, DOCX, DOC, and TXT are allowed.")

    # Parsing with error handling
    try:
        text = textract.process(file_path).decode('utf-8')
        if not text.strip():
            raise ValueError("Parsed text is empty. Resume content could not be extracted.")
        return text
    except Exception as e:
        raise RuntimeError(f"Failed to parse resume: {str(e)}")
