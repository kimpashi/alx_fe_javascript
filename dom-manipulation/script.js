// ===============================================
// Dynamic Quote Generator with Categories + Filter
// ===============================================

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
    // default quotes
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
  const filter = localStorage.getItem("selectedCategory") || "all";
  let filteredQuotes = quotes;

  if (filter !== "all") {
    filteredQuotes = quotes.filter(q => q.category === filter);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>${quote.category}</strong>: "${quote.text}"</p>
  `;

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

    saveQuotes();
    populateCategories(); // refresh categories if new one added

    document.getElementById("quoteDisplay").innerHTML = `<p style="color:green;">New quote added!</p>`;

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

// ===== Populate Categories Dropdown =====
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Save current selection to restore later
  const currentValue = localStorage.getItem("selectedCategory") || "all";

  // Clear dropdown except "All"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === currentValue) option.selected = true;
    categoryFilter.appendChild(option);
  });

  // Store selection
  categoryFilter.value = currentValue;
}

// ===== Filter Quotes Based on Selected Category =====
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// ===== Export to JSON File =====
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
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
        populateCategories();
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
  populateCategories();

  // Event listener for "Show New Quote"
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Show last viewed or random
  const lastQuote = loadLastViewedQuote();
  if (lastQuote) {
    document.getElementById("quoteDisplay").innerHTML = `
      <p><em>Last session quote:</em><br>
      <strong>${lastQuote.category}</strong>: "${lastQuote.text}"</p>
    `;
  } else {
    showRandomQuote();
  }
}

init();
