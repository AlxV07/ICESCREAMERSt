//  === Endpoint Connection Methods ===

async function search() {
  /*
  Called by search button; sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = document.getElementById("acronym").value;
  const context = document.getElementById("context").value;

  const response = await fetch("/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, context })
  });

  const results = await response.json();

  handleSearchResponse(results);
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
  resultsDiv.innerHTML = results.length
    ? results.map(r => `<p><strong>${r.expansion}</strong>: ${r.description}</p>`).join("")
    : "<p>No results found.</p>";
}
