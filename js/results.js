(() => {
  const $ = id => document.getElementById(id);
  const student = Store.getStudent(), res = Store.getResults();
  const doneCount = Object.keys(res).length, N = CHAPTERS.length;
  const justParam = parseInt(new URLSearchParams(location.search).get('just'), 10);
  const just = justParam >= 0 && justParam < N ? justParam : null;

  if (!student || doneCount === 0) {
    $('content').innerHTML = `<h1>Your results</h1>
      <div class="msg">📝 No tests taken yet. Take a chapter test to see your result here.</div>
      <a class="btn" href="test.html">Take a test</a>`;
    return;
  }

  const totalMax = CHAPTERS.reduce((s, c) => s + c.questions.length, 0);
  const totalScore = Object.values(res).reduce((s, r) => s + r.score, 0);
  const finished = doneCount === N;
  const badge = BADGES.find(b => totalScore / totalMax >= b.min);

  let h = `<h1>Results for ${esc(student.name)}</h1>`;
  if (student.group) h += `<p class="lead">${esc(student.group)}</p>`;

  if (just !== null && res[just]) {
    const r = res[just];
    h += `<div class="msg" role="status"><span class="score">You scored ${r.score} out of ${r.total} in Chapter ${just + 1}!</span><br>` +
      (r.score === r.total ? 'Perfect! 🌟' : r.score >= r.total * 0.75 ? 'Great job! 👏' : 'Good try! Read the chapter again and retake the test.') + '</div>';
  }
  if (!finished) h += `<div class="msg">You have finished ${doneCount} of ${N} tests. Finish the rest to see your final score and badge.</div>`;

  h += '<div class="card" id="summary">' + CHAPTERS.map((c, i) => {
    const r = res[i];
    return `<div class="row${i === just ? ' just' : ''}"><span>${c.emoji} Chapter ${i + 1}: ${esc(c.title)}</span>` +
      (r ? `<span><span class="score">${r.score}/${r.total}</span> <a href="test.html?ch=${i}">Retake</a></span>`
         : `<a class="btn alt" href="test.html?ch=${i}">Take test</a>`) + '</div>';
  }).join('') + '</div>';

  if (finished) {
    h += `<div class="hero"><div><h2>Final score: ${totalScore} / ${totalMax}</h2><p><b>${badge.name}!</b> ${badge.text}</p></div><div class="big" aria-hidden="true">${badge.emoji}</div></div>`;
  }

  h += '<h2 style="margin-top:28px">Check your answers</h2>';
  h += CHAPTERS.map((c, i) => {
    const r = res[i];
    if (!r) return '';
    return `<details${i === just ? ' open' : ''}><summary>${c.emoji} Chapter ${i + 1}: ${esc(c.title)} (${r.score}/${r.total})</summary>` +
      c.questions.map((q, qi) => {
        const mine = r.answers[qi], right = q[2], good = mine === right;
        return `<div class="rv"><p>${qi + 1}. ${esc(q[0])}</p>
          <p class="a">Your answer: <span class="${good ? 'ok' : 'no'}">${esc(q[1][mine])} ${good ? '✓' : '✗'}</span></p>` +
          (good ? '' : `<p class="a">Correct answer: <span class="ok">${esc(q[1][right])}</span></p>`) + '</div>';
      }).join('') + '</details>';
  }).join('');

  h += '<div class="actions">' +
    '<a class="btn" href="test.html">Take another test</a>' +
    (finished ? '<button class="btn alt" id="print">Print certificate</button>' : '') +
    '<button class="btn alt" id="csv">Download results (CSV)</button>' +
    '<button class="btn alt" id="reset">New student</button></div>';

  if (finished) {
    h += `<div id="certificate"><div style="font-size:4rem" aria-hidden="true">${badge.emoji}</div>
      <h1>Certificate of Achievement</h1><p>This is proudly given to</p>
      <div class="name">${esc(student.name)}</div>
      ${student.group ? `<p>${esc(student.group)}</p>` : ''}
      <p>for completing all ${N} Little Green Learners tests with a score of <b>${totalScore} out of ${totalMax}</b>.</p>
      <h2>${badge.name}</h2><p>${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>`;
  }
  $('content').innerHTML = h;

  const p = $('print');
  if (p) p.addEventListener('click', () => {
    document.body.classList.add('print-cert');
    window.print();
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('print-cert'));

  $('csv').addEventListener('click', () => {
    const q = v => '"' + String(v).replace(/"/g, '""') + '"';
    const rows = [['Student', 'Class / school', 'Chapter', 'Score', 'Out of', 'Date']];
    CHAPTERS.forEach((c, i) => {
      const r = res[i];
      if (r) rows.push([student.name, student.group || '', 'Chapter ' + (i + 1) + ': ' + c.title, r.score, r.total, r.date.slice(0, 10)]);
    });
    const blob = new Blob(['\ufeff' + rows.map(r => r.map(q).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'results-' + student.name.replace(/\W+/g, '-').toLowerCase() + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('reset').addEventListener('click', () => {
    if (confirm('Clear this student\'s name and results from this device and start fresh?')) {
      Store.clearAll();
      location.href = 'test.html';
    }
  });
})();
