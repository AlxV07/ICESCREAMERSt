//  === Endpoint Connection Methods ===


let currentFilter = "all";
let allResults = [];
let filteredResults = [];
let extractedAcronyms = [];

const acronymInput = document.getElementById("acronym");
const tagInput = document.getElementById("tags");
const API_BASE_URL = "http://localhost:5000/api";

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  define();
  setupEventListeners();
  setupPDFUpload();
});

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", function () {
      switchTab(this.getAttribute("data-tab"));
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
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
});

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
  Called by search button (if AI-search is enabled TODO-implement toggle); sends search query to server, expects response in established search-query-response data format.
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
  const tags = document.getElementById("defineTags").value;
  const misc = document.getElementById("defineMisc").value;

  const response = await fetch("/define", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acronym, term, definition, tags, misc })
  });
  const results = await response.json();
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

async function handleDefineResponse(response) {
  // TODO: Implement
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
  if (checkbox.checked) {
    AISearch = true;
  } else {
    AISearch = false;
  }
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
    body: JSON.stringify({ acronym, term, definition, tags, misc }),
  });
  const results = await response.json();
  console.log(results);
  await handleDefineResponse(results);
}

// Setting up the PDF tab
function setupPDFUpload() {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("pdfFileInput");
  const extractBtn = document.getElementById("extractBtn");
  const addAllBtn = document.getElementById("addAllBtn");
  const removeFileBtn = document.getElementById("removeFile");

  // Click to upload
  uploadArea.addEventListener("click", () => fileInput.click());

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      handleFileSelection(files[0]);
    } else {
      showMessage("Please select a valid PDF file", "error");
    }
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  // Extract button
  extractBtn.addEventListener("click", extractAcronymsFromPDF);

  // Add all button
  addAllBtn.addEventListener("click", addAllExtractedAcronyms);

  // Remove file button
  removeFileBtn.addEventListener("click", removeSelectedFile);
}

function switchTab(tabName) {
  // Update button states
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update content visibility
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabName}-tab`).classList.add("active");
}

function handleFileSelection(file) {
  if (file.size > 10 * 1024 * 1024) {
    // 10MB limit
    showMessage("File size must be less than 10MB", "error");
    return;
  }

  // Show file info
  document.getElementById("fileName").textContent = file.name;
  document.getElementById("fileSize").textContent = formatFileSize(file.size);
  document.getElementById("selectedFileInfo").style.display = "flex";
  document.getElementById("extractBtn").disabled = false;

  // Store file
  window.selectedPDFFile = file;
}

function removeSelectedFile() {
  document.getElementById("selectedFileInfo").style.display = "none";
  document.getElementById("extractBtn").disabled = true;
  document.getElementById("pdfFileInput").value = "";
  document.getElementById("extractedPreview").style.display = "none";
  window.selectedPDFFile = null;
  extractedAcronyms = [];
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function extractAcronymsFromPDF() {}