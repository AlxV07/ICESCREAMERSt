import csv, ast
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

CSV_FILE = "data/acronyms.csv"

def parse_line(raw_acronym):
    short=raw_acronym['Acronym']
    term=raw_acronym['Term']
    definition = raw_acronym['Definition']
    tags=ast.literal_eval(raw_acronym['Tags'])
    misc=ast.literal_eval(raw_acronym['Misc'])
    new_acronym = {"acronym":short, "term":term, "defintion":definition, "tags":tags, 'misc':misc}
    return new_acronym

@app.route("/")
def index():
    return render_template("index.html")


def load_acronyms():
    acronyms = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            acronyms.append(parse_line(row))
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
    print(results, type(results))
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
    context = data.get("context", "").lower()

    if not acronym or not term:
        return jsonify({"error": "Acronym and term are required"}), 400

    save_acronym(acronym, term, definition, context)
    return jsonify({"message": "Acronym added successfully"}), 201


def save_acronym(acronym, term, definition, context):
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([acronym.upper(), term, definition, context.lower()])


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
