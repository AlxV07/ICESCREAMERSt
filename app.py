from flask import Flask, render_template, request, jsonify
import csv
import os

app = Flask(__name__)

# Load acronym database TODO: temp for testing, backend devs you implement database stuff :D
# with open("data/acronyms.json") as f:
#     acronyms = json.load(f)


CSV_FILE = "data/acronyms.csv"

# Create the CSV file with headers if it doesn't exist
def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Acronym', 'Term', 'Definition', 'Context'])

init_csv()

def load_acronyms():
    acronyms = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            acronyms.append({
                'acronym': row['Acronym'].upper(),
                'term': row['Term'],
                'definition': row['Definition'],
                'tags': row['Tags'].lower().split()
            })
    return acronyms

@app.route("/search", methods=["POST"])
def search():
    data = request.json
    acronym = data.get("acronym", "").upper()
    search_tags = data.get("tags", "").lower().split()

    acronyms = load_acronyms()

    results = [entry for entry in acronyms if entry['acronym'] == acronym]
    # Basic relevance sort by context keyword match (placeholder)
    results_sorted = sorted(results, key=lambda x: sum(keyword in x["tags"] for keyword in search_tags), reverse=True)
    print(f"Search results for acronym '{acronym}': {results_sorted}")
    return jsonify(results_sorted)

def save_acronym(acronym, term, definition, context):
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([acronym.upper(), term, definition, context.lower()])

@app.route("/")
def index():
    return render_template("index.html")




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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
