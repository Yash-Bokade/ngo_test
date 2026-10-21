// Saves the student's name and test results in the browser (localStorage).
// If the browser blocks storage, it falls back to memory for the current page only.
const Store = (() => {
  const KEY = 'lgl.v1';
  let mem = { student: null, results: {} };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* use memory */ }
    return mem;
  }
  function save(data) {
    mem = data;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  return {
    getStudent() { return load().student; },
    setStudent(name, group) {
      const d = load();
      d.student = { name, group };
      save(d);
    },
    getResults() { return load().results || {}; },
    saveResult(ch, answers, score) {
      const d = load();
      d.results = d.results || {};
      d.results[ch] = { answers, score, total: CHAPTERS[ch].questions.length, date: new Date().toISOString() };
      save(d);
    },
    clearAll() { save({ student: null, results: {} }); }
  };
})();

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
