# 👨‍💼 Waseem M Ansari

**Data Scientist | LLM Agent Developer | IIT Madras Alumnus**  
📫 [Email](mailto:wsmaisys@gmail.com) • [GitHub](https://github.com/wsmaisys) • [LinkedIn](www.linkedin.com/in/wsmaisys)

---

## 🧠 About Me

Versatile and results-driven Data Scientist with hands-on experience in developing and deploying AI/ML solutions using Python, Scikit-learn, FastAPI, and Docker. Strong foundation in mathematics, statistics, and machine learning, with a unique background in law and retail business. Passionate about using data to build impactful AI solutions.

---

## 🚀 Projects

### 🔹 [RudeBot 😈 - Your Sassy AI Companion](https://github.com/wsmaisys/RudeBot)
[Live Demo](https://rudebot-mistral.streamlit.app/)

Meet RudeBot – the AI that tells it like it is (with extra sass). Get ready for brutally honest answers wrapped in hilarious sarcasm. Perfect for when polite chatbots just bore you to tears.

**Key Features:**
- Unfiltered Sass: Finally, an AI that roasts you while answering your questions
- Surprisingly Helpful: Behind the attitude lies actual useful information
- Persistent Memory: Remembers your conversations (and probably holds grudges)
- Real-time Streaming: Watch the insults unfold in real-time
- Threaded Conversations: Switch between different roast sessions effortlessly
- VS Code Dark Theme: Easy on the eyes during your verbal beatdown

**Tech Stack:**
- Python, Mistral AI, LangGraph, Prompt Engineering
- Streamlit, Docker


### 🔹 [Mogambo Voice AI Scheduler](https://github.com/wsmaisys/mogambo-voice-ai-scheduler)
[Live App](https://mogambo-voice-ai-scheduler-124439177573.asia-south2.run.app/)

Privacy-first, expert-grade calendar assistant for Google Calendar. Combines advanced AI, robust voice recognition, and seamless automation for context-aware scheduling and natural conversation—via both text and voice.

**Key Features:**
- Voice & Text Input: Natural interaction with backend voice transcription and secure processing.
- Google Calendar Automation: Create, update, retrieve, and delete events with full traceability and security.
- Intelligent Event Matching: Suggests event matches for ambiguous requests, ensuring precise updates and deletions.
- Clarification Workflow: Prompts for missing information, referencing prior context for expert-level conversation.
- Privacy & Security: Zero data retention, instant logout on window close, and session isolation.
- Modern UI: Responsive chat and calendar interface powered by Bootstrap and FullCalendar.

**Tech Stack:**
- Backend: FastAPI, LangGraph, LangChain, Google Calendar API, SpeechRecognition, pydub, gTTS
- Frontend: Bootstrap, FullCalendar, custom chat UI


### 🔹 [Jurisol: AI-Powered Indian Legal Assistant](https://github.com/wsmaisys/Jurisol-legal-assistant-RAG)
[Docker Hub](https://hub.docker.com/r/wasimansariiitm/jurisol-legal-assistant)

Intelligent, AI-powered legal research assistant for Indian law. Leverages Retrieval-Augmented Generation (RAG) and Qdrant vector database to deliver precise, context-aware answers to legal queries by searching and synthesizing information from a curated database of Indian legal documents.

**Key Features:**
- Instant Legal Insights: Accurate, referenced answers to complex legal questions.
- AI-Powered Search: Combines natural language processing and vector search for deep, relevant results.
- Indian Law Focus: Specially tailored for Indian statutes, case law, and legal principles.
- User-Friendly Interface: Streamlit frontend for interactive chat; FastAPI backend for robust API.
- Transparent Citations: Every answer is backed by references to actual legal documents.

**Tech Stack:**
- Python 3.12+
- FastAPI (backend API)
- Streamlit (frontend UI)
- Qdrant (vector database for semantic search)
- MistralAI (LLM and embeddings)
- LangChain (LLM orchestration, vector search, summarization)
- TavilySearch (online search tool for Indian government sites)
- PyPDF2, BeautifulSoup4 (document parsing)
- Docker (containerization)


### 🔹 [AI Agent: Interview Prep Assistant](https://github.com/wsmaisys/Interview_Prep_Assistant)
[Live App](https://interview-prep-assistant.streamlit.app/)

Sophisticated AI-powered interview preparation tool that generates custom mock interview questions and answers. Built with Streamlit and powered by the Mistral AI language model, this application helps you practice and prepare for your next interview with personalized Q&A sessions.

**Key Features:**
- Custom Question Generation: Generate interview questions based on specific topics and difficulty levels
- Detailed Answers: Get comprehensive answers to help you understand the concepts better
- Beautiful Dark Theme UI: Modern, responsive interface with a sleek dark theme
- Real-time Generation: Quick and efficient question-answer generation
- Multiple Topics: Support for various interview topics and difficulty levels
- Progressive Difficulty: Practice with increasing complexity
- Instant Feedback: Get immediate answers and explanations
- User-friendly Interface: Intuitive design for seamless experience
- Responsive Layout: Works perfectly on all devices

**Tech Stack:**
- Frontend: Streamlit
- Backend: Python
- AI Model: Mistral AI
- Styling: Custom CSS with gradient effects


### 🔹 [BikeValuePro: Used Bike Price Predictor](https://github.com/wsmaisys/usedbike_price_predictor_mlmodel)
[Live App](https://usedbike-price-predictor-mlmodel.onrender.com/)
[Docker Hub](https://hub.docker.com/r/wasimansariiitm/bikevaluepro-used_bike_price_predictor)

Powerful and intelligent web app that predicts the fair market value of a used bike using advanced Machine Learning. Whether you're selling your ride or buying one, BikeValuePro helps you get the best deal with confidence.

**Key Features:**
- Accurate Price Prediction: Predicts resale value of a bike with over 94.9% model accuracy.
- AI-Driven Insights: Trained on thousands of real-world sales records and engineered with domain logic.
- User-Friendly Interface: Clean, modern UI with form-based inputs and dependent dropdowns (State → City, Brand → Bike Model).
- Smart Feedback: Personalized strengths and weaknesses of your bike profile based on mileage, location, age, and performance.
- Market Context Analysis: Real-world negotiation tips, resale insight, and price ranges with confidence intervals.

**Tech Stack:**
- Frontend: Streamlit
- Backend: Python, Scikit-learn, XGBoost
- Data: Cleaned dataset of used bikes (India-specific)
- Model: Trained regression pipeline using XGBoost with preprocessing via ColumnTransformer

### 🔹 [Photo Journal App: Google Cloud](https://blog-app-699175796072.asia-south2.run.app/)
**GitHub:** [wsmaisys/google-cloud-app](https://github.com/wsmaisys/google-cloud-app)
**Live App:** [Visit the Blog App](https://blog-app-699175796072.asia-south2.run.app/)

Welcome to the Blog App — a simple yet powerful journal-style application deployed on Google Cloud Run. Users can create and view blog posts with image uploads, thanks to seamless integration with multiple Google Cloud services. This project demonstrates key Google Cloud Platform skills including Cloud Run, Cloud SQL, and Cloud Storage.

**Key Features:**
- Upload blog posts with images
- Add your name, title, and content
- View all posts in reverse chronological order

**Google Cloud Skills Demonstrated:**
- **Google Cloud Run:** Containerized Flask app deployed and auto-scaled with HTTP traffic, secured via HTTPS
- **Google Cloud SQL (MySQL):** Persistent, structured storage for blog entries, accessed securely via Unix socket
- **Google Cloud Storage:** Image uploads and public URLs for embedding images in posts
- **Environment Variables:** Secure storage of DB and bucket configs in Cloud Run

**Tech Stack:**
- Python
- Flask
- Google Cloud SQL (MySQL)
- Google Cloud Storage
- Google Cloud Run
- HTML + CSS (frontend templating)

### 🔹 [Matchy: Text Similarity Detector](https://hub.docker.com/r/wasimansariiitm/text-similarity-detector)

**Live Demo:** [text-similarity-detector.onrender.com](https://text-similarity-detector.onrender.com/)
**GitHub:** [wsmaisys/Text_similarity_detection](https://github.com/wsmaisys/Text_similarity_detection)

**Summary:**
Matchy is an AI-powered application for detecting similarity between pairs of text using fuzzy logic and semantic analysis (Word2Vec). Optimized for real-world text data like Quora question pairs, it provides duplicate detection and confidence scores in a modern, responsive UI.

**Key Features:**
- Compare two questions and detect semantic similarity
- Returns "Duplicate" or "Not Duplicate" with a confidence probability
- History log of all questions asked in the session
- Smart ML pipeline: preprocessing, 21 custom features, Word2Vec embeddings, XGBoost classifier
- Modern dark UI with live feedback and elegant styling
- Dockerized for easy deployment

**Tech Stack:**
- Python
- Flask
- XGBoost
- Word2Vec
- Docker
- HTML + CSS (frontend)

### 🔹 [AI-Powered Assignment Solver](https://project-2-vercel-app-llm-agent-1.onrender.com)

**Live Demo:** [assignment-solving-agent.onrender.com](https://assignment-solving-agent.onrender.com/)
**GitHub:** [wsmaisys/Assignment_Solving_Agent](https://github.com/wsmaisys/Assignment_Solving_Agent)

**Summary:**
An AI-powered file-processing and question-answering agent that accepts user-uploaded files (ZIP, CSV, PDF, Excel, JSON), analyzes them entirely in memory, and dynamically generates Python code using Mistral AI to solve structured data tasks. All code is securely executed in a sandboxed environment via FastAPI.

**Key Features:**
- AI-generated code execution using Mistral API (`mistral-small-latest`)
- File type identification with format-specific logic
- Context-aware code generation based on file metadata and user question
- In-memory file processing (ZIP, CSV, JSON, Excel, PDF, etc.)
- Self-debugging workflow: automatic error correction via retry mechanism
- SHA256 hashing, date normalization (ISO 8601), type conversions
- FastAPI server with CORS, deployable via Render or serverless platforms

**Tech Stack:**
- Python
- FastAPI
- Mistral API
- Pandas, pdfplumber, openpyxl, numpy, PIL
- Docker

### 🔹 [Automated Task Handler with Flask](https://hub.docker.com/r/wasimansariiitm/my-ai-agent)
**GitHub:** [wsmaisys/Automated_File_Handler](https://github.com/wsmaisys/Automated_File_Handler)
**Docker Hub:** [wasimansariiitm/my-ai-agent](https://hub.docker.com/r/wasimansariiitm/my-ai-agent)

**Summary:**
An intelligent automation API for secure file processing and business task automation. Runs inside a container and interacts via simple API requests, automating over 20+ data and business tasks using AI capabilities.

**Key Features:**
- Fully automated AI-powered task execution
- Secure file processing within `/data/` directory
- API-driven architecture for triggering tasks and reading files
- Prevents data exfiltration and deletion; ensures data integrity
- Fast, scalable, and compliant with security best practices
- Supports data processing (formatting, extraction, analysis), business automation (API fetching, web scraping, git operations), and file/image processing

**Tech Stack:**
- Python
- Flask
- Docker
- Pandas, SQLite, Markdown, OpenCV, requests

### 🔹 [System Threat Forecaster (Top 5% on Kaggle)](https://www.kaggle.com/wasimansari786)
Created a supervised ML pipeline with Random Forest and XGBoost achieving 63% accuracy in classifying threats.

---

## 💼 Work Experience

**Retail Manager** — AHAAN LIMITED (Kingston Upon Hull, UK) | *Dec 2022 – Sep 2023*  
- Led compliance and strategic sales planning that boosted revenue by 20%.
- Inspired ML-based solutions for pricing, demand forecasting and retail analytics.

**Import Export Entrepreneur** — AHLAN EXPORTS (Dehradun, India) | *Sep 2021 – Nov 2022*
- Managed international B2B logistics, compliance and digital marketing funnels.
- Experience translates into AI interest in supply chain modeling and optimization.  

**Real Estate Consultant** — FAHZAM PROPERTIES (Dubai, UAE) | *Feb 2015 – Jan 2020*  
- Facilitated sales, conducted training, and optimized lead generation with digital tools.
- Insights now inform AI projects in real estate valuation and docs automation.  

**Legal Associate** — QUISLEX LEGAL SERVICES (Hyderabad, India) | *Sep 2013 – Mar 2014*  
- Conducted legal document reviews for financial litigation investigations  

---

## 🎓 Education

- **Diploma in Data Science** – IIT Madras *(2024–Present)*  
- **Bachelor of Law (LLB)** – University of Pune *(2007–2012)*

---

## 📜 Certifications

- Digital Marketing – Codestar & Udemy (2020)  
- Real Estate Broker – Dubai Real Estate Institute (2015)

---

## 🧰 Skills

**Programming & Scripting:**  
`Python`, `SQL`, `Bash`

**AI/ML & Data Science:**  
`LLMs (Mistral, LangChain, LangGraph)`, `Prompt Engineering`, `Retrieval-Augmented Generation (RAG)`, `NLP`, `Text Similarity`, `Semantic Search`, `Scikit-learn`, `XGBoost`, `Random Forest`, `Pandas`, `Numpy`, `pdfplumber`, `openpyxl`, `Word2Vec`, `Qdrant`, `PyPDF2`, `BeautifulSoup4`

**Web & App Development:**  
`FastAPI`, `Flask`, `Streamlit`, `Bootstrap`, `FullCalendar`, `HTML`, `CSS`, `Custom UI/UX`, `SpeechRecognition`, `pydub`, `gTTS`

**Cloud & DevOps:**  
`Docker`, `Google Cloud Run`, `Google Cloud SQL`, `Google Cloud Storage`, `Render`, `Git`, `GitHub Actions`, `CI/CD Pipelines`

**Automation & Integration:**  
`API Automation`, `Web Scraping`, `Business Task Automation`, `File Processing`, `Secure Execution`, `CORS`, `Markdown`, `OpenCV`, `requests`, `SQLite`

**Other:**  
Data Visualization, Legal Research, Project Management, Retail Analytics, Supply Chain Modeling, Real Estate Valuation Automation

---

> © 2025 Wasim Ansari — Open to roles in Data Science, AI Engineering, and Agentic AI Development.
