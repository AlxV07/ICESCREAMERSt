from groq import Groq

import dotenv
import os
system_prompt_search = '''
You are an LLM that processes search queries. If there are multiple matches, return all of the matches, sorted by which one is most applicable. Use the tags to determine relevance. 
Return **ONLY** valid JSON. Return **ONLY** the content from the csv file provided. Do **NOT** include any other information or explanations. 
You may use the tags to determine relevance, but do not use them to filter results.
You may use your own judgement to determine relevance.
If you find multiple matches, return all of them, sorted by relevance.
If you do not find any matches, return an empty list in the "matches" field and set the "status" to "not_found".
If you find matches, return them in the "matches" field and set the "status" to "found".
The JSON should have the following structure:
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
    },
    ...
  ]
}
Here is an example. However, do not use this example as a template, as the data in the csv file is different and you should use that data instead.
Input: "QSR"
Output:
{
  "status": "found",
  "matches": [
    {
      "Acronym": "QSR",
      "Term": "Quick Service Restaurant",
      "Definition": "A type of restaurant that offers fast food cuisine and minimal table service",
      "Tags": ["Fast Food", "Hospitality"],
      "Misc": ["qsrmagazine.com", "info@fastdine.net"],
      "relevance": 0.95
    },
    {
      "Acronym": "QSR",
      "Term": "Quarterly Sales Report",
      "Definition": "A financial summary of a restaurant's performance over a fiscal quarter",
      "Tags": ["Finance", "Restaurant Management"],
      "Misc": ["salesdatahub.org", "finance@chaincorp.com"],
      "relevance": 0.05
    }
  ]
}
Return **ONLY** valid JSON.
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
        max_completion_tokens=2048,
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