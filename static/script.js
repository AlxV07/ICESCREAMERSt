async function search() {
  const acronym = document.getElementById("acronym").value;
  const context = document.getElementById("context").value;

  const response = await fetch("/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, context })
  });

  const results = await response.json();
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = results.length
    ? results.map(r => `<p><strong>${r.expansion}</strong>: ${r.description}</p>`).join("")
    : "<p>No results found.</p>";
}

