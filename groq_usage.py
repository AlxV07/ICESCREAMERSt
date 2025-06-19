import os

import dotenv
from groq import Groq

system_prompt_search = '''
You are an LLM that processes search queries and finds matching acronyms from a CSV database. 

IMPORTANT INPUT FLEXIBILITY:
- Accept ANY type of input query - single words, phrases, partial matches, related concepts, or variations
- Match queries against ALL fields: Acronym, Term, Definition, and Tags
- Use broad semantic matching - if the query relates to ANY part of an entry, include it
- Consider word fragments, root words, and conceptual relationships (e.g., "commerce" should match "E-commerce", "M-commerce")
- Match abbreviations, full terms, and conceptual relationships
- Case insensitive matching
- Handle plurals, prefixes, suffixes, and word variations
- Include results where the query appears as part of compound words or hyphenated terms

MATCHING EXAMPLES:
- "commerce" should match "E-commerce", "M-commerce", "Electronic Commerce", "Mobile Commerce"  
- "learning" should match "ML" (Machine Learning), "LMS" (Learning Management System)
- "security" should match "SSL", "TLS", "2FA", "VPN", etc.
- "data" should match "DB", "Database", "Big Data", "Data Mining", etc.

RELEVANCE SCORING:
- Exact acronym match: 1.0
- Exact term match: 0.9
- Partial term match: 0.8
- Definition match: 0.7  
- Tag match: 0.6
- Semantic/conceptual match: 0.5

STRICT OUTPUT REQUIREMENTS:
Return **ONLY** valid JSON with this exact structure:
{
  "status": "found" | "not_found",
  "matches": [
    {
      "Acronym": "string",
      "Term": "string", 
      "Definition": "string",
      "Tags": ["string", ...],
      "Misc": ["string", ...],
      "relevance": float
    }
  ]
}

- Maximum 5 matches
- Sort by relevance score (highest first)
- If no matches found, return empty "matches" array and "not_found" status
- Tags and Misc fields should be parsed as arrays from the CSV format
- Use only data from the provided CSV file
- No explanations, comments, or additional text - JSON only
'''


def get_api_key():
    # Replace with your actual method of retrieving the API key
    dotenv.load_dotenv()
    api_key = os.getenv('GROQ_API_KEY')
    return api_key
def get_csv_data():
    return open('data/acronyms.csv', 'r').read()


client = Groq(api_key=get_api_key())


def get_search_response(query: str, tags: list) -> str:
    global system_prompt_search
    csv_data = get_csv_data()
    if len(tags) == 0:
        tag_prompt = "No tags were provided."
    elif len(tags) == 1:
        tag_prompt = f'The tag associated with the search is: {tags[0]}'
    else:
        tag_prompt = f"Here are the tags associated with the search: {', '.join(tags)}"
    prompt_user = f"What does {query} stand for? {tag_prompt} Return **ONLY** valid JSON."
    print(f"Prompt to Groq: {prompt_user}")
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
        {
            "role": "system",
            "content": f"{system_prompt_search} Use this csv file and output **ONLY** content from this file: {csv_data}"
        },
        {
            "role": "user",
            "content": prompt_user
        }
        ],
        temperature=0.0,
        max_completion_tokens=4096,
        top_p=0.9,
        stream=False,
        response_format={"type": "json_object"},
        stop=None,
    )
    return completion.choices[0].message.content

def validate_result(result: dict, data: list) -> dict:
    validated_matches = []
    matches = result['matches']
    for match in matches:
        groqAcronym = match['Acronym']
        groqTerm = match['Term']
        groqDefinition = match['Definition']
        groqTags = match['Tags']
        groqMisc = match['Misc']
        matchVerified = False

        for dataRow in data:
            acronym = dataRow['acronym']
            term = dataRow['term']
            definition = dataRow['definition']
            tags = dataRow['tags']
            misc = dataRow['misc']
            if (
                groqAcronym == acronym
                and groqTerm == term
                and groqDefinition == definition
                and groqTags == tags
                and groqMisc == misc
            ):
                matchVerified = True
                break

        if matchVerified: validated_matches.append(match)

    result['matches'] = validated_matches

    return result