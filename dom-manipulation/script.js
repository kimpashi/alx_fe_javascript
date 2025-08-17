// =======================================================
// Dynamic Quote Generator (Parts 1–4)
// - DOM creation
// - Local & Session Storage
// - JSON Import/Export
// - Category filter
// - Simulated Server sync + Conflict Resolution
// =======================================================

// ---------------------------
// CONFIG (Server simulation)
// ---------------------------
const SERVER_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
// Map server post -> quote: use "title" as text, "Server" category
// We only fetch first N to keep things light
const SERVER_FETCH_LIMIT = 10;
// Auto-sync period (ms)
const AUTO_SYNC_MS = 60000;

// ---------------------------
// App State
// ---------------------------
let quotes = [];                 // { id: string, text: string, category: string, source?: 'local'|'server', updatedAt?: number }
let autoSyncTimer = null;
let conflicts = [];              // list of { id, local, server }
let isAutoSyncOn = false;

// ---------------------------
// Storage helpers
// ---------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { id: "s-1", text: "The best way to predict the future is to create it.", category: "Motivation", source: "local", updatedAt: Date.now() },
      { id: "s-2", text: "Life is what happens when you’re busy making other plans.", category: "Life", source: "local", updatedAt: Date.now() },
      { id: "s-3", text: "Happiness depends upon ourselves.", category: "Philosophy", source: "local", updatedAt: Date.now() }
    ];
    saveQuotes();
  }
}

function s
