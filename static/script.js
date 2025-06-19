//  === Endpoint Connection Methods ===

function addListeners() {
    document.getElementById("acronym").addEventListener("keydown", (e) => {
        if (e.code === 'Enter') {
            search();
        }
    })
}
addListeners();

async function search() {
  /*
  Called by search button; sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = document.getElementById("acronym").value;
  const context = document.getElementById("tags").value;

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, context })
  });
  const results = await response.json();
  console.log(results);
  await handleSearchResponse(results);
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

function generateHTMLFromTerm(term_data) {
    acronym = term_data.acronym;
    term = term_data.term;
    def = term_data.definition;
    tags = term_data.tags;  // lists
    misc = term_data.misc;

    console.log(tags)

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


async function handleSearchResponse(response) {
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
