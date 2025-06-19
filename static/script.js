//  === Endpoint Connection Methods ===

async function search() {
  /*
  Called by search button; sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = document.getElementById("acronym").value;
  const context = document.getElementById("context").value;

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, context })
  });
  const results = await response.json();
  console.log(results)
  await handleSearchResponse(results);
}


async function define() {
  /*

  */
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
