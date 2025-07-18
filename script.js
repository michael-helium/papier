document.addEventListener('DOMContentLoaded', () => {
  const noteCanvas = document.getElementById('note-canvas');
  const toggleDarkBtn = document.getElementById('toggle-dark');
  const clearNotesBtn = document.getElementById('clear-notes');
  const wordCountSpan = document.getElementById('word-count');

  // Load saved notes and dark mode preference
  chrome.storage.local.get(['notes', 'darkMode'], (data) => {
    if (data.notes) {
      noteCanvas.innerHTML = marked.parse(data.notes);
      updateWordCount(data.notes);
    }
    if (data.darkMode) {
      document.body.classList.add('dark-mode');
    }
  });

  // Real-time Markdown rendering and auto-save
  noteCanvas.addEventListener('input', () => {
    const text = noteCanvas.innerText; // Get plain text for word count
    const html = marked.parse(text);  // Convert to HTML with Markdown
    noteCanvas.innerHTML = html;      // Render HTML back
    updateWordCount(text);
    chrome.storage.local.set({ notes: text });
  });

  // Toggle dark mode
  toggleDarkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    chrome.storage.local.set({ darkMode: isDark });
  });

  // Clear notes
  clearNotesBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      noteCanvas.innerHTML = '';
      wordCountSpan.textContent = '0 words, 0 lines';
      chrome.storage.local.remove('notes');
    }
  });

  // Update word and line count
  function updateWordCount(text) {
    const words = text.split(/\s+/).filter(Boolean).length;
    const lines = text.split('\n').length;
    wordCountSpan.textContent = `${words} words, ${lines} lines`;
  }

  // Focus on canvas when page loads
  noteCanvas.focus();
});
