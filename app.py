from flask import Flask, render_template, request, jsonify

import json

app = Flask(__name__)

# Load acronym database TODO: temp for testing, backend devs you implement database stuff :D
# with open("data/acronyms.json") as f:
#     acronyms = json.load(f)
acronyms = json.loads("""
{
"ABC": "Amazing Bacon Cheese"
}
""")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/lookup", methods=["POST"])
def lookup():
    data = request.json
    acronym = data.get("acronym", "").upper()
    context = data.get("context", "").lower()

    results = acronyms.get(acronym, [])
    # Basic relevance sort by context keyword match (placeholder)
    results_sorted = sorted(results, key=lambda x: context in x["context_keywords"], reverse=True)

    return jsonify(results_sorted)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
