from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# ✅ Load dataset
movies = pd.read_csv("../ml-model/movies.csv")

# ✅ Prepare features
movies["combined"] = (
    movies["genres"].fillna("") + " " +
    movies["keywords"].fillna("") + " " +
    movies["overview"].fillna("")
)

# ✅ Vectorize text
vectorizer = TfidfVectorizer(stop_words="english")
matrix = vectorizer.fit_transform(movies["combined"])

# ✅ Compute similarity
similarity = cosine_similarity(matrix)

def get_recommendations(movie):
    movie = movie.lower()

    # ✅ exact match
    exact_match = movies[movies['original_title'].str.lower() == movie]

    # ✅ partial match
    partial_matches = movies[
        movies['original_title'].str.lower().str.contains(movie, regex=False)
    ]

    # ❌ no match
    if partial_matches.empty:
        return {"error": "Movie not found"}

    # ✅ suggestion only (NOT exact)
    if exact_match.empty:
        suggestion = partial_matches.iloc[0]['original_title']
        return {"suggestion": suggestion}

    # ✅ exact match → recommend
    index = exact_match.index[0]

    scores = list(enumerate(similarity[index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    results = []
    for i in scores[1:6]:
        results.append(movies.iloc[i[0]]['original_title'])

    return {
        "matched": movies.iloc[index]['original_title'],
        "results": results
    }


@app.route("/", methods=["GET"])
def home():
    return "Backend is running ✅", 200


@app.route("/recommend", methods=["GET", "POST"])
def recommend_route():
    if request.method == "GET":
        return "Use POST to send movie name 🎬", 200

    data = request.get_json(force=True)
    movie = data.get("movie")

    results = get_recommendations(movie)
    return jsonify(results), 200


if __name__ == "__main__":
    app.run()