from groq import Groq
system_prompt_search = '''
You are a llm that processes search queries. If there are multiple matches, return all of the matches, sorted by which one you think is most applicable using the tags. 
Return **ONLY** valid JSON. 
Here is an example. Choose one of the status codes to output. 
{
  "status": "found" | "notFound" | "error",
  "matches": [
    {
      "Acronym": "AI",
      "Term": "Artificial Intelligence",
      "Definition": "The simulation of human intelligence in machines",
      "Tags": ["Software Development", "Data Science"],
      "Misc": ["example.com", "contact@gmail.com"],
      "relevance": 0.9
    },
    {
      "Acronym": "AI",
      "Term": "Adobe Illustrator",
      "Definition": "A vector graphics editor developed by Adobe",
      "Tags": ["Design", "Software"],
      "Misc": ["example.com", "contact@gmail.com"],
      "relevance": 0.1
    }
  ]
}
'''
def get_api_key():
    # Replace with your actual method of retrieving the API key
    return "your_api_key_here"
def get_csv_data():
    return open('data/acronyms.csv', 'r').read()
client = Groq(api_key=get_api_key())

def get_search_response(query: str, tags: list) -> str:
    global system_prompt_search
    csv_data= get_csv_data()
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
        {
            "role": "system",
            "content": f"{system_prompt_search} Use this csv file and output only content from this file: {csv_data}"
        },
        {
            "role": "user",
            "content": f"what does {query} stand for? Here are the tags associated with the search: {', '.join(tags)}"
        }
        ],
        temperature=0.48,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        response_format={"type": "json_object"},
        stop=None,
    )
    return completion.choices[0].message.content