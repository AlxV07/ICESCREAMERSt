from groq import Groq

def get_api_key():
    # Replace with your actual method of retrieving the API key
    return "your_api_key_here"
def get_csv_data():
    return open('data/acronyms.csv', 'r').read()
client = Groq(api_key=get_api_key())

def get_search_response(query: str) -> str:
    csv_data= get_csv_data()
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
        {
            "role": "system",
            "content": f"You are a llm that processes search queries. If there are multiple matches, return all of the matches, sorted by which one you think is most applicable. Respond in JSON format. Use this csv file: {csv_data}"
        },
        {
            "role": "user",
            "content": f"what does {query} stand for?"
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