let currentFilter = "all";
let allResults = [];
let filteredResults = [];

const acronymInput = document.getElementById("acronym");
const tagInput = document.getElementById("tags");

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", function () {
      switchTab(this.getAttribute("data-tab"));
    });
  });
}

let defineContainer = null;
let searchContainer = null;

document.addEventListener("DOMContentLoaded", async function () {
  setupEventListeners();
  await populateTags();
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      tabButtons.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      // Hide all tab contents
      tabContents.forEach((content) => content.classList.remove("active"));

      // Show the selected tab content
      const target = btn.getAttribute("data-tab") + "-tab";
      document.getElementById(target).classList.add("active");
    });
  });

  searchContainer = document.getElementById("searchContainer");
  defineContainer = document.getElementById("defineContainer");
  defineContainer.remove();
});

const defineButton = document.getElementById("defineButton");
const defineButtonContainer = document.getElementById("defineButtonContainer");
defineButton.addEventListener("click", (e) => {
    if (defineButton.textContent === 'Define New Term') {
        document.body.appendChild(defineContainer);
        searchContainer.remove();
        defineButton.textContent = 'Back To Search';
        defineButtonContainer.style.justifyContent = 'left';
    } else {
        document.body.appendChild(searchContainer);
        defineContainer.remove();
        defineButton.textContent = 'Define New Term';
        defineButtonContainer.style.justifyContent = 'right';
    }
})

function addListeners() {
    acronymInput.addEventListener("input", (e) => {
        if (!AISearch) {  // real time update
            search();
        }
    });
    acronymInput.addEventListener("keydown", (e) => {
        if (e.code === 'Enter') {
            search();
        }
    });
    tagInput.addEventListener("keydown", (e) => {
        if (e.code === 'Enter') {
            search();
        }
    });
}
addListeners();


async function search() {
    if (AISearch) {
        groqSearch();
    } else {
        manualSearch();
    }
}

async function groqSearch() {
  /*
  Called by search button; sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = acronymInput.value;
  const tags = document.getElementById("tags").value;
  document.getElementById("results").innerHTML = `<iframe id="gif" style="width:fit-content;height:fit-content" src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1268.gif"></iframe>Loading...`
  const gif = document.getElementById("gif")
  gif.style.width = "600px"
  gif.style.height = "400px"

  const response = await fetch("/search_groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, tags })
  });
  const results = await response.json();
  await handleGroqSearchResponse(results);
}

async function manualSearch() {
  /*
  Called by search button; sends search query to server, expects response in established search-query-response data format.
  */
  const acronym = acronymInput.value;
  const tags = document.getElementById("tags").value;

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, tags })
  });
  const results = await response.json();
  await handleManualSearchResponse(results);
}

async function define() {
  const acronym = document.getElementById("defineAcronym").value;
  const term = document.getElementById("defineTerm").value;
  const definition = document.getElementById("defineDefinition").value;
  const tags = document.getElementById("defineTags").value;  // TODO; read from select's map, concat -> list
  const misc = document.getElementById("defineMisc").value; // TODO; be from list

  const response = await fetch("/define", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, term, definition, tags, misc })
  });
  const results = await response.json();
  await handleDefineResponse(results);
}

async function populateTags() {
    const response = await fetch("/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
    const results = await response.json();
    await handlePopulateTagsResponse(results);
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
            <div style="color: white;
                background-color: #D62311;
                width: fit-content;
                padding: 7px; margin-left: 5px; border-radius: 15px;">${tag.toLowerCase()}</div>
        `
    })
    tag_html = `<div style="display: flex; flex-direction: horizontal">${tag_html}</div>`

    misc_html = ''
    misc.forEach(m => {
        misc_html += `
        <div style="border: 1px solid gray; padding: 10px;">${m}</div>
        `
    })
    misc_html = `<div>${misc_html}</div>`

    return `
    <div style="margin-bottom: 80px;">
        <h2 style="margin-top: 4px;">${acronym} - ${term}</h2>
        ${tag_html}<br>
        ${def}<br><br>
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
  final_html = "";
  for (const a of response.matches) {
    final_html += generateHTMLFromTerm(a, true);
  }
  if (final_html === "") {
    final_html = "No terms found using AI Search. Try using manual search in Settings."
  }
  resultsDiv.innerHTML = final_html;
}

async function handlePopulateTagsResponse(response) {
    const select = document.getElementById('defineTags');
    select.innerHTML = '';
    select.tags = new Set();
    select.appendChild(document.createElement('option'));
    response.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        select.appendChild(option);
    });
    const defineTagsContainer = document.getElementById('defineTagsContainer');
    select.addEventListener('change', (e) => {
        if (select.value !== "") {
            if (select.tags.has(select.value)) {
                return;
            }
            select.tags.add(select.value);
            const tag = document.createElement('div');
            tag.textContent = select.value;
            tag.style.backgroundColor = '#D62311';
            tag.style.width = 'fit-content';
            tag.style.padding = '10px';
            tag.style.margin = '10px';
            tag.style.borderRadius = '5px';
            tag.style.color = 'white';
            const button = document.createElement('button');
            button.addEventListener('click', e => {
                select.tags.delete(tag.textContent);
                tag.remove();
                delete button;
                delete tag;
            })
            button.addEventListener('mouseenter', e => {
                button.style.color = 'black';
            })
            button.addEventListener('mouseleave', e => {
                button.style.color = 'white';
            })
            button.style.color = 'white';
            button.style.background = 'transparent';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.textContent = '(X)';
            tag.appendChild(button);
            defineTagsContainer.appendChild(tag);
        }
    })
}

let AISearch = false;

// === Settings Handlers ===
function showSettings() {
  document.getElementById("settingsPanel").classList.add("visible");
}

function hideSettings() {
  document.getElementById("settingsPanel").classList.remove("visible");
}

function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  panel.classList.toggle("visible");
}

function toggleAISearch(checkbox) {
  AISearch = checkbox.checked;
}