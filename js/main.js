/* =========================================================
   みほん屋 sample LP - main.js（外部ライブラリなし）
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  var PC_QUERY = window.matchMedia('(min-width: 1024px)');

  /* ----- Hamburger menu ----- */
  var toggle = document.querySelector('.hamburger');
  var nav = document.getElementById('global-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && !PC_QUERY.matches) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  PC_QUERY.addEventListener('change', function () { setMenu(false); });

  /* ----- Header shadow ----- */
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Menu tabs（矢印キーで移動できる） ----- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs__tab'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ----- Fade in ----- */
  var targets = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  } else {
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('is-visible'); });
  }

  /* ----- Reservation form（サンプルのため送信しない） ----- */
  var form = document.getElementById('reserve-form');
  var result = document.getElementById('form-result');
  var dateInput = document.getElementById('f-date');

  function todayStr() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  dateInput.min = todayStr();

  var rules = {
    'f-name': function (v) { return v.trim() ? '' : 'お名前を入力してください。'; },
    'f-tel': function (v) {
      if (!v.trim()) return '電話番号を入力してください。';
      return /^[0-9０-９\-－()（）\s]{10,16}$/.test(v.trim()) ? '' : '電話番号は数字とハイフンで入力してください（例: 000-0000-0000）。';
    },
    'f-date': function (v) {
      if (!v) return 'ご来店日を選んでください。';
      if (v < todayStr()) return '今日以降の日付を選んでください。';
      var day = new Date(v + 'T00:00:00').getDay();
      return day === 3 ? '水曜日は定休日です。ほかの日を選んでください。' : '';
    }
  };

  function validate(id) {
    var input = document.getElementById(id);
    var msg = rules[id](input.value);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    document.getElementById(id + '-err').textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(function (id) {
    document.getElementById(id).addEventListener('blur', function () { validate(id); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(rules).forEach(function (id) {
      if (!validate(id) && !firstInvalid) firstInvalid = document.getElementById(id);
    });
    if (firstInvalid) {
      result.textContent = '';
      firstInvalid.focus();
      return;
    }
    result.textContent = 'このフォームはポートフォリオ用のサンプルです。入力内容はどこにも送信されていません。';
  });
})();
