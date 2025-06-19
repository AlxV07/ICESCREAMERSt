import csv, os
import ast
CSV_FILE = r'C:\Users\aruns\Documents\GitHub\ICESCREAMERSt\data\acronyms.csv'
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
    print(f"Acronym: {acronym['acronym']}, Term: {acronym['term']}, Definition: {acronym['definition']}, Tags: {acronym['tags']}")
    short=acronym['acronym']
    term=acronym['term']
