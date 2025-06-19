from flask import Flask, render_template, request, jsonify
import csv
import os

app = Flask(__name__)

CSV_FILE = "data/acronyms.csv"


@app.route("/")
def index():
    return render_template("index.html")


def load_acronyms():
    acronyms = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            acronyms.append({
                'acronym': row['Acronym'].upper(),
                'term': row['Term'],
                'definition': row['Definition'],
                'tags': row['Tags'].lower().split(),
                'misc': row['Misc'].lower().split()
            })
    return acronyms


@app.route("/search", methods=["POST"])
def respond_to_search_query():
    """
    Handles search query from frontend
    :return: json-formatted response to send to frontend
    """
    data = request.json

    acronym = data.get("acronym", "").upper()
    tags = data.get("tags", "").lower().split()

    results = find_results(acronym, tags)
    return jsonify(results)


def find_results(target_acronym: str, tags: list) -> list:
    """
    :param target_acronym: target acronym to search for
    :param tags: list of tags associated in the search
    :return: the list response results
    """
    acronyms = load_acronyms()

    # Basic relevance sort by context keyword match (placeholder)
    results = [entry for entry in acronyms if entry['acronym'] == target_acronym]
    results_sorted = sorted(results, key=lambda x: sum(keyword in x["tags"] for keyword in tags), reverse=True)
    return results_sorted


@app.route("/define", methods=["POST"])
def define_acronym():
    data = request.json
    acronym = data.get("acronym", "").upper()
    term = data.get("term", "")
    definition = data.get("definition", "")
    tags = data.get("tags", "").lower().split()

    if not acronym or not term:
        return jsonify({"error": "Acronym and term are required"}), 400

    save_acronym(acronym, term, definition, tags)
    return jsonify({"message": "Acronym added successfully"}), 201


def save_acronym(acronym, term, definition, context):
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([acronym.upper(), term, definition, context.lower()])


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
