// Step 2: JavaScript Implementation

// 1. Create an array of quote objects
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" }
];

// 2. Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>${quote.category}</strong>: "${quote.text}"</p>
  `;
}

// 3. Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
