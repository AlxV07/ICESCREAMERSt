//  === Endpoint Connection Methods ===

async function search() {
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


async function handleSearchResponse(response) {
  /*
  Handles search-query-response from endpoint
  response: search-query-response in established data format
  */
  const resultsDiv = document.getElementById("results");
  console.log(response);
  resultsDiv.innerHTML = JSON.stringify(response);
  // TODO: Temporary; just displaying stringified display
  // change to setting innerHTML to be styled response
}

async function handleDefineResponse(response) {
  // TODO: Implement
}
