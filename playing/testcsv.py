import csv, os
import ast
CSV_FILE = r'C:\Users\aruns\Documents\GitHub\ICESCREAMERSt\data\acronyms.csv'

def parse_line(raw_acronym):
    short=raw_acronym['acronym']
    term=raw_acronym['term']
    definition = raw_acronym['definition']
    tags=ast.literal_eval(raw_acronym['tags'])
    new_acronym = {"acronym":short, "term":term, "defintion":definition, "tags":tags}
    return new_acronym

acronyms = []
with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        acronyms.append({
            'acronym': row['Acronym'].upper(),
            'term': row['Term'],
            'definition': row['Definition'],
            'tags': row['Tags'].lower()
        })
print(f"Loaded {len(acronyms)} acronyms from {CSV_FILE}")
for acronym in acronyms:
    #print(f"Acronym: {acronym['acronym']}, Term: {acronym['term']}, Definition: {acronym['definition']}, Tags: {acronym['tags']}")
    x=parse_line(acronym)
    print(x)
