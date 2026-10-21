(() => {
  const $ = id => document.getElementById(id);
  const views = ['profile', 'picker', 'quiz'];
  let ch = null, idx = 0, answers = [];

  function show(name) {
    views.forEach(v => { $(v).hidden = v !== name; });
    window.scrollTo(0, 0);
    const h = $(name).querySelector('h1,h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  /* 1. Student details */
  function showProfile() {
    const s = Store.getStudent();
    $('name').value = s ? s.name : '';
    $('group').value = s ? s.group : '';
    show('profile');
  }
  $('profile-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('name').value.trim();
    if (!name) { $('profile-err').textContent = 'Please type your name to continue.'; $('name').focus(); return; }
    Store.setStudent(name, $('group').value.trim());
    $('profile-err').textContent = '';
    const want = chapterFromUrl();
    want !== null ? startQuiz(want) : showPicker();
  });

  /* 2. Choose a chapter */
  function showPicker() {
    const s = Store.getStudent(), res = Store.getResults();
    $('hello').textContent = 'Hello, ' + s.name + '!';
    $('chapter-list').innerHTML = CHAPTERS.map((c, i) => {
      const r = res[i];
      return `<button class="pick${r ? ' done' : ''}" data-ch="${i}">
        <span class="em">${c.emoji}</span><span class="pill">Chapter ${i + 1}</span>
        <h3>${esc(c.title)}</h3><small>${esc(c.subtitle)}</small>
        <small><b>${r ? 'Done: ' + r.score + '/' + r.total + '. Tap to retake.' : 'Tap to start the test'}</b></small></button>`;
    }).join('');
    show('picker');
  }
  $('chapter-list').addEventListener('click', e => {
    const b = e.target.closest('[data-ch]');
    if (b) startQuiz(+b.dataset.ch);
  });
  $('change-student').addEventListener('click', showProfile);

  /* 3. Questions, one at a time */
  function startQuiz(n) {
    ch = n; idx = 0; answers = [];
    show('quiz');
    drawQuestion();
  }
  function drawQuestion() {
    const c = CHAPTERS[ch], q = c.questions[idx], total = c.questions.length;
    $('quiz-title').textContent = c.emoji + ' ' + c.title;
    $('count').textContent = 'Question ' + (idx + 1) + ' of ' + total;
    $('bar').style.width = (idx / total * 100) + '%';
    $('question').innerHTML = `<fieldset><legend>${esc(q[0])}</legend>` +
      q[1].map((o, oi) => `<label class="opt"><input type="radio" name="opt" value="${oi}" ${answers[idx] === oi ? 'checked' : ''}>${esc(o)}</label>`).join('') +
      '</fieldset>';
    $('back').hidden = idx === 0;
    $('next').textContent = idx === total - 1 ? 'Finish test' : 'Next question';
    $('quiz-err').textContent = '';
  }
  $('question').addEventListener('change', e => { answers[idx] = +e.target.value; $('quiz-err').textContent = ''; });
  $('back').addEventListener('click', () => { idx--; drawQuestion(); });
  $('next').addEventListener('click', () => {
    if (answers[idx] === undefined) { $('quiz-err').textContent = 'Please choose an answer first.'; return; }
    if (idx < CHAPTERS[ch].questions.length - 1) { idx++; drawQuestion(); return; }
    const score = answers.filter((a, i) => a === CHAPTERS[ch].questions[i][2]).length;
    Store.saveResult(ch, answers, score);
    location.href = 'results.html?just=' + ch;
  });
  $('quit').addEventListener('click', showPicker);

  /* Start */
  function chapterFromUrl() {
    const n = parseInt(new URLSearchParams(location.search).get('ch'), 10);
    return n >= 0 && n < CHAPTERS.length ? n : null;
  }
  if (!Store.getStudent()) showProfile();
  else { const w = chapterFromUrl(); w !== null ? startQuiz(w) : showPicker(); }
})();
