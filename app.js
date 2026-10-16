/* CJ'S — the two interactive pieces. */

// ── 03 The day: the hours open and close ───────────────────────────
(function () {
  var mount = document.getElementById('hours');
  if (!mount) return;

  var HOURS = [
    ['07.45', 'We are outside, quietly', 'The truck is parked and the kettle question has already been settled — we bring our own. Nobody knocks before eight unless you have asked us to.'],
    ['08.00', 'Everything gets wrapped', 'Before a single thing is lifted it is blanketed, taped or crated, and written down. Yes, including the things you have told us do not need it. Especially those.'],
    ['10.30', 'The truck is loaded in order', 'Not in the order things come to hand — in the order they need to come off at the other end. This is the part that decides whether the afternoon is calm.'],
    ['12.30', 'We stop and eat', 'You are having lunch with us. This is not optional in any real sense, though of course it is entirely optional.'],
    ['14.00', 'The new place fills up', 'Room by room, in the order we loaded it, so nothing is stacked in a hallway waiting to be moved a second time.'],
    ['16.00', 'It goes back together', 'Beds rebuilt, shelves up, pictures on walls, the wardrobe that came apart in the old house made whole again in this one. You point, we adjust. As many times as it takes.'],
    ['18.00', 'We take one last look', 'Packaging out, floors clear, and a slow walk through every room with you. Then we leave you to it, which is the best part of the job.']
  ];

  HOURS.forEach(function (row, i) {
    var el = document.createElement('div');
    el.className = 'hour';
    el.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
    el.innerHTML =
      '<button class="hour-head" aria-controls="hour-body-' + i + '">' +
        '<span class="hour-time mono">' + row[0] + '</span>' +
        '<span class="hour-title">' + row[1] + '</span>' +
        '<span class="hour-mark">' + (i === 0 ? '–' : '+') + '</span>' +
      '</button>' +
      '<div class="hour-body" id="hour-body-' + i + '"><span></span><p>' + row[2] + '</p></div>';

    el.querySelector('.hour-head').addEventListener('click', function () {
      var open = el.getAttribute('aria-expanded') === 'true';
      mount.querySelectorAll('.hour').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.querySelector('.hour-mark').textContent = '+';
      });
      if (!open) {
        el.setAttribute('aria-expanded', 'true');
        el.querySelector('.hour-mark').textContent = '–';
      }
    });
    mount.appendChild(el);
  });
})();

// ── 06 Come in: pick a day, leave the addresses ────────────────────
(function () {
  var card = document.getElementById('request');
  if (!card) return;

  var DAYS = [
    ['23.10.27', true], ['26.10.27', true], ['29.10.27', true], ['02.11.27', false],
    ['05.11.27', true], ['09.11.27', false], ['12.11.27', true], ['16.11.27', true]
  ];

  var step = 0;
  var chosen = 0;
  var daysEl = document.getElementById('days');
  var backBtn = document.getElementById('back');
  var nextBtn = document.getElementById('next');
  var heldEl = document.getElementById('heldDate');

  DAYS.forEach(function (d, i) {
    var b = document.createElement('button');
    b.className = 'day';
    b.type = 'button';
    b.disabled = !d[1];
    b.setAttribute('aria-pressed', String(i === chosen));
    b.innerHTML = '<b class="mono">' + d[0] + '</b><span class="mono">' + (d[1] ? 'Open' : 'Taken') + '</span>';
    b.addEventListener('click', function () {
      chosen = i;
      daysEl.querySelectorAll('.day').forEach(function (other, j) {
        other.setAttribute('aria-pressed', String(j === i));
      });
    });
    daysEl.appendChild(b);
  });

  function render() {
    card.querySelectorAll('[data-step]').forEach(function (panel) {
      panel.hidden = Number(panel.dataset.step) !== step;
    });
    backBtn.disabled = step === 0;
    backBtn.textContent = step === 2 ? '← Start again' : '← Back';
    nextBtn.innerHTML =
      (step === 0 ? 'That day, please' : step === 1 ? 'Submit the application' : 'Back to the start') +
      ' <span>→</span>';
    if (step === 2) heldEl.textContent = DAYS[chosen][0];
  }

  // The application is sent as an email the visitor sends themselves: nothing
  // here stores it, so it has to leave the page to reach Chris and Jeremy.
  function sendApplication() {
    var field = function (name) {
      var el = card.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : '';
    };
    var notesEl = card.querySelector('.fields textarea');
    var lines = [
      'Date I would like: ' + DAYS[chosen][0],
      'Moving from: ' + field('from'),
      'Moving to: ' + field('to'),
      'My name: ' + field('name'),
      'Best way to reach me: ' + field('contact'),
      '',
      notesEl && notesEl.value.trim() ? notesEl.value.trim() : ''
    ];
    window.location.href = 'mailto:info@cjsmovingcompany.com'
      + '?subject=' + encodeURIComponent('Applying for ' + DAYS[chosen][0])
      + '&body=' + encodeURIComponent(lines.join('\n').trim());
  }

  nextBtn.addEventListener('click', function () {
    if (step === 1) sendApplication();
    step = step === 2 ? 0 : step + 1;
    render();
    card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  backBtn.addEventListener('click', function () {
    step = step === 2 ? 0 : Math.max(0, step - 1);
    render();
  });

  render();
})();

// ── the menu ───────────────────────────────────────────────────────
(function () {
  var overlay = document.getElementById('menu');
  var openBtn = document.querySelector('.menu-btn');
  if (!overlay || !openBtn) return;
  var closeBtn = overlay.querySelector('.menu-close');

  function open() {
    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.body.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();

// ── the ticker clock (club time, Toronto) ──────────────────────────
(function () {
  var el = document.getElementById('clock');
  if (!el) return;
  // Toronto's own time, with its real abbreviation: EDT in summer, EST in winter
  var fmt = null;
  try {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Toronto', hourCycle: 'h23',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    });
  } catch (e) {}
  function tick() {
    if (!fmt) { el.textContent = new Date().toTimeString().slice(0, 8); return; }
    var parts = fmt.formatToParts(new Date()), t = [], zone = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.type === 'hour' || p.type === 'minute' || p.type === 'second') t.push(p.value);
      if (p.type === 'timeZoneName') zone = p.value;
    }
    el.textContent = t.join(':') + (zone ? ' ' + zone : '');
  }
  tick();
  setInterval(tick, 1000);
})();

// ── the odometer: Truck No. 23 drives, the kilometres click up ─────
//    It only ever counts forward: between visits it grows at the rate a
//    one-move-a-day truck really does, and while you watch it drives a
//    kilometre every few seconds. A visitor never sees it go backwards.
(function () {
  var el = document.getElementById('odometer');
  if (!el) return;

  var BASE     = 301657;                          // km on the morning this went live
  var EPOCH    = Date.UTC(2026, 9, 16, 4, 0, 0);   // 16 Oct 2026, midnight in Toronto
  var PER_SEC  = 40000 / (365.25 * 86400);         // ~40,000 km a year between visits
  var TICK_MS  = 3000;                             // on screen: a kilometre every three seconds
  var KEY      = 'cjs-odometer-km';
  var still    = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shown    = '';

  function byClock() { return BASE + Math.floor(Math.max(0, Date.now() - EPOCH) / 1000 * PER_SEC); }
  function recall()  { try { return parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) { return 0; } }
  function keep(v)   { try { localStorage.setItem(KEY, String(v)); } catch (e) {} }

  function render(v, rolling) {
    var s = v.toLocaleString('en-CA');
    var html = '';
    for (var i = 0; i < s.length; i++) {
      var turned = rolling && shown.length === s.length && shown.charAt(i) !== s.charAt(i);
      html += '<span class="d' + (turned ? ' roll' : '') + '">' + s.charAt(i) + '</span>';
    }
    el.innerHTML = html;
    shown = s;
  }

  var km = Math.max(byClock(), recall());
  render(km, false);
  keep(km);
  if (still) return;                               // a parked truck doesn't add kilometres

  setInterval(function () {
    if (document.hidden) return;                   // nor does one nobody is watching
    km = Math.max(km + 1, byClock());
    keep(km);
    render(km, true);
  }, TICK_MS);
})();
