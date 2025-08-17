// ===============================================
// Dynamic Quote Generator with Web Storage + JSON
// ===============================================

// Global quotes array
let quotes = [];

// ===== Local Storage Helpers =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // default quotes if nothing in storage
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { text: "Happiness depends upon ourselves.", category: "Philosophy" }
    ];
    saveQuotes();
  }
}

// ===== Session Storage Example (last viewed quote) =====
function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastViewedQuote() {
  const stored = sessionStorage.getItem("lastQuote");
  return stored ? JSON.parse(stored) : null;
}

// ===== Display Random Quote =====
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>${quote.category}</strong>: "${quote.text}"</p>
  `;

  // Save to session storage
  saveLastViewedQuote(quote);
}

// ===== Add Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);

    saveQuotes(); // persist to local storage

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p style="color:green;">New quote added!</p>`;

    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category!");
  }
}

// ===== Dynamically Create Form =====
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// ===== Export to JSON File =====
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty-print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ===== Import from JSON File =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Must be an array of quotes.");
      }
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Init App =====
function init() {
  loadQuotes();
  createAddQuoteForm();

  // Event listener for "Show New Quote"
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // If a last viewed quote exists (session), show it
  const lastQuote = loadLastViewedQuote();
  if (lastQuote) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><em>Last session quote:</em><br>
      <strong>${lastQuote.category}</strong>: "${lastQuote.text}"</p>
    `;
  }
}

init();
