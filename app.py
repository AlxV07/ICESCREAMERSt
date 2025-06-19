import csv

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
CSV_FILE = "data/acronyms.csv"


@app.route("/")
def index():
    return render_template("index.html")


def load_acronyms():
    # TODO: Skanda replace below w/ your parsing method
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
    app.run(host='0.0.0.0', port=5000, debug=True)
