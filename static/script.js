let currentFilter = "all";
let allResults = [];
let filteredResults = [];
let extractedAcronyms = [];

const API_BASE_URL = "http://localhost:5000/api";

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
 // define();
  setupeventlisters();
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

//  === Endpoint Connection Methods ===


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
/*
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
*/
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

// === Frontend Util Methods ===


