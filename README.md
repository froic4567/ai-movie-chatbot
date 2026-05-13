

#  AI Movie Recommendation System
## Electives 2: Mahine Learning
##  Project Overview
This project is a full-stack AI-powered web application created by the group Electives of Froilan Acera CpE_3A that recommends movies based on user input.
It uses a machine learning content-based recommendation model and provides personalized suggestions
through an interactive chatbot-style interface.

The system supports user authentication, persistent chat history, and intelligent movie recommendations.

---

##  Objectives
- Build an AI-powered recommendation system
- Apply machine learning concepts (TF-IDF & cosine similarity)
- Develop a full-stack web application
- Implement authentication and database persistence

---

## 🧠 AI / Machine Learning Component
The AI core is a **content-based recommendation system** trained using a dataset of 5,000 movies movies.csv dataset from kaggle.

### Techniques used:
- Natural Language Processing (NLP)
- TF-IDF Vectorization
- Cosine Similarity

The model analyzes movie genres, keywords, and descriptions to find similar movies.
If a user enters a partial title, the system intelligently suggests the closest matching movie.

---
##  Technology Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Vite

### Backend
- Flask (Python)
- REST API

### AI / ML
- Pandas
- Scikit-learn
- TF-IDF
- Cosine Similarity

### Database & Auth
- Supabase (Authentication + PostgreSQL)

### Deployment
- Frontend: Vercel
- Backend: Render / Railway (planned)

---

## ✅ Features
- User authentication (Login / Signup)
- AI-powered movie recommendations
- Partial movie title suggestions
- Persistent chat history per user
- Movie posters via OMDb API
- Responsive UI

---

## 🛠️ Setup Instructions

### Frontend
```bash
cd ai-chatbot
npm install


cd backend
pip install -r requirements.txt
python app.py


cd ml-model
jupyter notebook movie_model.ipynb

