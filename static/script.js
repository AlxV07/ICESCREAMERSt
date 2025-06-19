//  === Endpoint Connection Methods ===

function addListeners() {
    document.getElementById("acronym").addEventListener("keydown", (e) => {
        if (e.code === 'Enter') {
//            manualSearch();
            groqSearch();
        }
    })
}
addListeners();

async function groqSearch() {
  /*
  Called by search button (if AI-search is enabled TODO-implement toggle); sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = document.getElementById("acronym").value;
  const tags = document.getElementById("tags").value;
  document.getElementById("results").innerHTML = `<iframe style="width:fit-content;height:fit-content" src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1268.gif"></iframe>Loading...`

  const response = await fetch("/search_groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, tags })
  });
  const results = await response.json();
  console.log(results);
  await handleGroqSearchResponse(results);
}

async function manualSearch() {
  /*
  Called by search button; sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = document.getElementById("acronym").value;
  const tags = document.getElementById("tags").value;

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, tags })
  });
  const results = await response.json();
  console.log(results);
  await handleManualSearchResponse(results);
}


async function define() {
  const acronym = document.getElementById("defineAcronym").value;
  const term = document.getElementById("defineTerm").value;
  const definition = document.getElementById("defineDefinition").value;
  const tags = document.getElementById("defineTags").value;
  const misc = document.getElementById("defineMisc").value;

  const response = await fetch("/define", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, term, definition, tags, misc })
  });
  const results = await response.json();
  console.log(results);
  await handleDefineResponse(results);
}


// === Frontend Util Methods ===

function generateHTMLFromTerm(term_data, isAI) {
    if (!isAI) {
        acronym = term_data.acronym;
        term = term_data.term;
        def = term_data.definition;
        tags = term_data.tags;  // list
        misc = term_data.misc;
    } else {
        acronym = term_data.Acronym;
        term = term_data.Term;
        def = term_data.Definition;
        tags = term_data.Tags;  // list
        misc = term_data.Misc;
    }

    tag_html = ''
    tags.forEach(tag => {
        tag_html += `
            <div style="color: black; background-color: red; width: fit-content; padding: 7px; margin-left: 5px; border-radius: 15px;">${tag}</div>
        `
    })
    tag_html = `<div style="display: flex; flex-direction: horizontal">${tag_html}</div>`

    misc_html = ''
    misc.forEach(m => {
        misc_html += `
        <div style="border: 1px solid gray">${m}</div>
        `
    })
    misc_html = `<div>${misc_html}</div>`

    return `
    <div>
        <h2 style="margin-top: 4px;">${acronym} - ${term}</h2>
        ${tag_html}<br>
        ${def}<br>
        ${misc_html}
    </div>
    `
}

async function handleManualSearchResponse(response) {
  /*
  Handles search-query-response from endpoint
  response: search-query-response in established data format
  */

  const resultsDiv = document.getElementById("results");
  console.log(response);
  final_html = "";
  for (const a of response) {
    final_html += generateHTMLFromTerm(a);
  }
  resultsDiv.innerHTML = final_html;
}

async function handleDefineResponse(response) {
  // TODO: Implement
}

async function handleGroqSearchResponse(response) {
  /*
  Handles ai-search-query-response from endpoint
  response: search-query-response in established data format
  */
  const resultsDiv = document.getElementById("results");
  console.log(response);
  final_html = "";
  for (const a of response.matches) {
    final_html += generateHTMLFromTerm(a, true);
  }
  resultsDiv.innerHTML = final_html;
}

async function handleDefineResponse(response) {
  // TODO: Implement
}
