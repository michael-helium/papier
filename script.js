document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('note-input');
  const notePreview = document.getElementById('note-preview');
  const toggleDarkBtn = document.getElementById('toggle-dark');
  const clearNotesBtn = document.getElementById('clear-notes');
  const wordCountSpan = document.getElementById('word-count');

  // Load saved notes and dark mode preference
  chrome.storage.local.get(['notes', 'darkMode'], (data) => {
    if (data.notes) {
      noteInput.value = data.notes;
      renderMarkdown(data.notes);
      updateWordCount(data.notes);
    }
    if (data.darkMode) {
      document.body.classList.add('dark-mode');
    }
  });

  // Real-time Markdown rendering and auto-save
  noteInput.addEventListener('input', () => {
    const text = noteInput.value;
    renderMarkdown(text);
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
      noteInput.value = '';
      notePreview.innerHTML = '';
      wordCountSpan.textContent = '0 words, 0 lines';
      chrome.storage.local.remove('notes');
    }
  });

  // Render Markdown to preview
  function renderMarkdown(text) {
    notePreview.innerHTML = marked.parse(text);
  }

  // Update word and line count
  function updateWordCount(text) {
    const words = text.split(/\s+/).filter(Boolean).length;
    const lines = text.split('\n').length;
    wordCountSpan.textContent = `${words} words, ${lines} lines`;
  }
});
