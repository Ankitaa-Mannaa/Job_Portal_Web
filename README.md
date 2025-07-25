PROJECT OVERVIEW


Design and develop an end-to-end recruitment platform that:
	•	Allows companies to post job openings.
	•	Enables candidates to register, apply, and upload resumes.
	•	Uses AI to analyze and score resumes, match them to jobs, and generate tailored interview questions.
	•	Provides an Admin + HR Dashboard to manage users, applications, interviews, and track analytics.
	•	Supports real-time chat with an AI agent trained on a candidate’s resume.
⸻
Core Features & Modules
Authentication & Authorization (JWT)
	•	Role-based (Admin, HR Manager, Candidate)
	•	Email verification & password reset
⸻
Candidate Portal  
	•	Profile management
	•	Resume upload (PDF)
	•	Skill & experience tagging
	•	View recommended jobs (AI-matched)
	•	Apply to jobs
	•	Track application status
	•	AI chat about job role fit
⸻
Company Portal
	•	Job posting & management
	•	Applicant tracking for each job
	•	AI-based resume scoring
	•	Interview round assignment & feedback
⸻
AI Modules (Python / Flask APIs)
A. Resume Parsing
	•	Use PyMuPDF, pdfminer, or textract to extract text.
	•	Parse name, email, phone, skills, education, experience.
	•	Store parsed data in DB.
B. Job-Candidate Matching
	•	Use sentence-transformers or OpenAI embeddings to:
	•	Vectorize job description and resume content.
	•	Calculate similarity score.
	•	Rank top matched jobs for candidate & best candidates for jobs.
C. Automated Scoring
	•	Rule + ML-based scoring for:
	•	Education match
	•	Years of experience
	•	Skill match ratio
D. Interview Question Generation
	•	Use OpenAI API or fine-tuned model to generate:
	•	3 role-specific screening questions per applicant.
E. AI Chatbot 
	•	Use LangChain or RAG model trained on resume/job data.
	•	Candidate can ask: “Why is this job a good fit for me?”
⸻
Admin Dashboard
	•	User stats
	•	Job stats
	•	Avg. resume score per job
	•	Drop-off analytics
	•	Export reports
⸻
Architecture Overview
Backend (Flask)
	•	Flask-RestX (for API docs)
	•	Flask-JWT-Extended
	•	SQLAlchemy ORM
	•	Background tasks with Celery + Redis
	•	File storage: AWS S3 or local
Frontend (React)
	•	Role-based dashboards
	•	State management (Redux or Context)
	•	Real-time chat with AI bot (Socket.io or Polling)
	•	Resume view + parsed data view
	•	Charts with Chart.js or Recharts
Database (MySQL)
	•	Users
	•	Jobs
	•	Applications
	•	InterviewRounds
	•	ResumeData (JSON fields)
	•	Scores
	•	Feedback
	•	AI_Chat_History