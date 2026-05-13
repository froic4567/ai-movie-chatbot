from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# ✅ load model
similarity = pickle.load(open("../ml-model/similarity.pkl", "rb"))
movies = pickle.load(open("../ml-model/movies.pkl", "rb"))

def recommend(movie):
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


@app.route("/recommend", methods=["GET", "POST"])
def get_recommendation():
    if request.method == "GET":
        return "Use POST to send movie name 🎬"

    data = request.json
    movie = data.get("movie")

    results = recommend(movie)
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)