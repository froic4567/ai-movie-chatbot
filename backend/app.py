from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ------------------------
# App setup
# ------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------------
# Load dataset (IMPORTANT)
# movies.csv MUST be inside backend/
# ------------------------
movies = pd.read_csv("movies.csv")

# ------------------------
# Prepare features
# ------------------------
movies["combined"] = (
    movies["genres"].fillna("") + " " +
    movies["keywords"].fillna("") + " " +
    movies["overview"].fillna("")
)

# ------------------------
# Vectorize text
# ------------------------
vectorizer = TfidfVectorizer(stop_words="english")
matrix = vectorizer.fit_transform(movies["combined"])

# ------------------------
# Compute similarity
# ------------------------
similarity = cosine_similarity(matrix)

# ------------------------
# Recommendation logic
# ------------------------
def get_recommendations(movie_name):
    movie_name = movie_name.lower()

    # Exact match
    exact_match = movies[movies["original_title"].str.lower() == movie_name]

    # Partial match
    partial_matches = movies[
        movies["original_title"].str.lower().str.contains(movie_name, regex=False)
    ]

    # No match at all
    if partial_matches.empty:
        return {"error": "Movie not found"}

    # Partial match only → suggestion
    if exact_match.empty:
        return {
            "suggestion": partial_matches.iloc[0]["original_title"]
        }

    # Exact match → recommend
    index = exact_match.index[0]
    scores = list(enumerate(similarity[index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    results = []
    for i in scores[1:6]:
        results.append(movies.iloc[i[0]]["original_title"])

    return {
        "matched": movies.iloc[index]["original_title"],
        "results": results
    }

# ------------------------
# Routes
# ------------------------
@app.route("/", methods=["GET"])
def home():
    return "Backend is running ✅", 200

@app.route("/recommend", methods=["POST"])
def recommend_route():
    data = request.get_json(force=True)
    movie = data.get("movie")

    if not movie:
        return jsonify({"error": "No movie provided"}), 400

    result = get_recommendations(movie)
    return jsonify(result), 200

# ------------------------
# Entry point (local only)
# Render uses gunicorn app:app
# ------------------------
if __name__ == "__main__":
    app.run()