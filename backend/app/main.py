from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="🤖 AGENTIC AI - Career Assistant Backend")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "AGENTIC AI Backend Running!", "version": "1.0.0"}

@app.post("/api/profile")
def analyze_profile(
    skills: str = Form(""), 
    interests: str = Form(""), 
    education: str = Form(""), 
    target_role: str = Form("")
):
    return {
        "summary": f"Profile analyzed for {target_role or 'Software Engineer'}",
        "strengths": [
            "Strong Python programming foundation",
            "Good problem solving skills", 
            f"{education} academic background",
            "Clear career goals"
        ],
        "gaps": [
            f"{target_role or 'target role'} specific frameworks",
            "Real-world project experience",
            "System design knowledge",
            "Interview preparation"
        ],
        "fit_score": 72
    }

@app.post("/api/jobs")
def get_jobs(target_role: str = Form("")):
    return {
        "recommended_roles": [
            {
                "title": "Software Engineer", 
                "fit": 85, 
                "why": "Strong Python + DSA matches 80% requirements",
                "next_steps": "Practice LeetCode Medium problems"
            },
            {
                "title": "Backend Developer", 
                "fit": 78, 
                "why": "Good problem solving + Python backend skills",
                "next_steps": "Learn FastAPI + PostgreSQL"
            },
            {
                "title": "Full Stack Developer", 
                "fit": 65, 
                "why": "Strong backend foundation, needs frontend",
                "next_steps": "Learn React + Next.js basics"
            }
        ]
    }

@app.post("/api/roadmap")
def get_roadmap(target_role: str = Form("")):
    role = target_role or "Software Engineer"
    return {
        "role": role,
        "duration": "4 weeks",
        "weeks": [
            {
                "week": 1,
                "focus": "Foundation Building",
                "tasks": [
                    "LeetCode Easy (20 problems)",
                    "System Design basics (Grokking course)",
                    f"{role} role requirements research"
                ]
            },
            {
                "week": 2,
                "focus": "Project Development",
                "tasks": [
                    "Build REST API project",
                    "Deploy to Render/Vercel",
                    "Add database integration"
                ]
            },
            {
                "week": 3,
                "focus": "Interview Preparation",
                "tasks": [
                    "LeetCode Medium (15 problems)",
                    "Mock technical interviews",
                    "Behavioral question practice"
                ]
            },
            {
                "week": 4,
                "focus": "Application Phase",
                "tasks": [
                    "Apply to 15+ relevant jobs",
                    "LinkedIn networking",
                    "Tailor resume for each role"
                ]
            }
        ]
    }

@app.post("/api/learnwhy")
def learn_why(subjects: str = Form(""), target_role: str = Form("")):
    role = target_role or "Software Engineer"
    subject_list = [s.strip() for s in subjects.split(',') if s.strip()]
    
    return {
        "target_role": role,
        "subjects_analyzed": len(subject_list),
        "explanations": [
            {
                "subject": "Data Structures & Algorithms",
                "relevance": "Core for technical interviews (80% coding rounds)",
                "skills_gained": ["Problem solving", "Time/Space complexity", "Optimization"],
                "career_value": "Directly tested in FAANG+ interviews",
                "project_idea": "Build LRU Cache or implement Graph algorithms"
            },
            {
                "subject": "Database Management Systems",
                "relevance": "Essential for Backend & Fullstack roles",
                "skills_gained": ["SQL optimization", "Normalization", "Indexing"],
                "career_value": "Every production app needs data storage",
                "project_idea": "Design e-commerce database schema + queries"
            },
            {
                "subject": "Operating Systems",
                "relevance": "System design & senior interviews",
                "skills_gained": ["Processes/Threads", "Memory management", "Concurrency"],
                "career_value": "Understanding how systems work under the hood",
                "project_idea": "Implement producer-consumer or deadlock solution"
            },
            {
                "subject": "Computer Networks",
                "relevance": "Distributed systems & DevOps roles",
                "skills_gained": ["HTTP/HTTPS", "TCP/IP", "Load balancing"],
                "career_value": "Every web app talks over network",
                "project_idea": "Build simple load balancer or proxy server"
            }
        ]
    }
