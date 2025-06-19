from groq import Groq

import dotenv
import os
system_prompt_search = '''
You are a llm that processes search queries. If there are multiple matches, return all of the matches, sorted by which one you think is most applicable using the tags. 
Return **ONLY** valid JSON. Return **ONLY** the content from the csv file provided. Do **NOT** include any other information or explanations. 
You may use the tags to determine relevance, but do not use them to filter results.
You may use your own judgement to determine relevance, but do not use any other data or information outside of the csv file provided.
If you cannot find any matches, return set "status" to "not_found". If you find matches, set "status" to "found", even if the matches are not perfect.
If the acronym provided is a prefix of one found in the csv, return the full acronym found in the csv, with all of its data.
For example, if the user searches for "QS", and the csv contains "QSR" and "QSRP", return both full "QSR" entry and the "QSRP" entry, but the "QSRP" entry should have a lower relevance score. The prefix itself should not appear in the results whatsoever.
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
      tag_prompt=f'Here are the tags associated with the search: {", ".join(tags)}'
    prompt_user=f"What does {query} stand for? {tag_prompt}"
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
