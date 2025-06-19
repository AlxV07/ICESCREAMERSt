import csv, ast
import os
from flask import Flask, render_template, request, jsonify
import groq_usage

app = Flask(__name__)
CSV_FILE = "data/acronyms.csv"


def parse_line(raw_acronym):
    short = raw_acronym['Acronym']
    term = raw_acronym['Term']
    definition = raw_acronym['Definition']
    tags = ast.literal_eval(raw_acronym['Tags'])
    misc = ast.literal_eval(raw_acronym['Misc'])
    new_acronym = {"acronym": short, "term": term, "definition": definition, "tags": tags, 'misc': misc}
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
    print(f"Searching for acronym: {acronym} with tags: {tags}")
    results = find_results(acronym, tags)
    return jsonify(results)


@app.route("/search_groq", methods=["POST"])
def respond_to_search_groq_query():
    """
    Handles search query from frontend
    :return: json-formatted response to send to frontend
    """
    data = request.json
    acronyms = load_acronyms()

    acronym = data.get("acronym", "").upper()
    tags = data.get("tags", "").lower().split()
    print(tags)
    string_result = groq_usage.get_search_response(acronym, tags)
    try:
        results = ast.literal_eval(string_result)
        print(f"Results from Groq: {results}")
        if not results:
            return jsonify({"error": "No results found"}), 404
        results = groq_usage.validate_result(results, acronyms)
        return jsonify(results)
    except Exception as e:
        print(f"Error parsing Groq response: {e}")
        print(string_result)
        return jsonify({"error": "Failed to parse Groq response"}), 500


def find_results(target_acronym: str, tags: list) -> list:
    """
    :param target_acronym: target acronym to search for
    :param tags: list of tags associated in the search
    :return: the list response results
    """
    acronyms = load_acronyms()

    results_sorted = []
    for entry in acronyms:
        score = 0
        if entry['acronym'].upper() == target_acronym.upper():
            score += 10
        elif entry['acronym'].upper().startswith(target_acronym.upper()):
            score += 5
        elif entry['acronym'].upper() in target_acronym.upper() or target_acronym.upper() in entry['acronym'].upper():
            score += 3


        tag_score = sum(keyword.strip().lower() in [tag.strip().lower() for tag in entry["tags"]] for keyword in tags)
        score += tag_score

        if len(tags) > 0:
            if tag_score > 0:
                results_sorted.append((entry, score))
        else:
            if score > 0:
                results_sorted.append((entry, score))

    # Sort results by score
    results_sorted = sorted(results_sorted, key=lambda x: x[1], reverse=True)
    print(results_sorted)
    return [entry for entry, score in results_sorted]


@app.route("/define", methods=["POST"])
def define_acronym():
    """
    :return: define status in expected data format to front end
    """

    data = request.json

    acronym = data.get("acronym", "").upper()
    term = data.get("term", "")
    definition = data.get("definition", "")
    tags = data.get("tags", "").lower().split()
    misc = data.get("misc", "").lower().split()

    result = save_acronym(acronym, term, definition, tags, misc)
    return jsonify(result)


def save_acronym(acronym: str, term: str, definition: str, tags: list, misc: list) -> dict:
    try:
        with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([acronym, term, definition, tags, misc])
        success = True
        info = str(f"Successfully added acronym {acronym} to database.")
    except Exception as e:
        success = False
        info = str(e)
    return {"status": "success" if success else "error", "info": info}


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
