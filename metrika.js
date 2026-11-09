/* Яндекс Метрика + цели + плашка про cookies */
(function () {
  var ID = 114152228;
  window.JB_YM = ID;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + ID, 'ym');

  window.ym(ID, 'init', { ssr: true, webvisor: true, clickmap: true, accurateTrackBounce: true, trackLinks: true });

  var goal = function (n) { try { window.ym(ID, 'reachGoal', n); } catch (e) {} };

  /* На главной цели уже шлёт сама страница; на кейсах ловим клики здесь */
  var path = location.pathname.replace(/\/+$/, '');
  var isHome = path === '' || /\/index(\.html)?$/.test(path);
  if (!isHome) {
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!a) return;
      var h = a.getAttribute('href') || '';
      if (/cv\/.*\.pdf/i.test(h)) goal('contact_cv');
      else if (/t\.me\//i.test(h)) goal('contact_tg');
      else if (/^mailto:/i.test(h)) goal('contact_mail');
    }, true);
  }

  /* Промежуточные цели: интерес к кейсам */
  var caseOf = function (h) {
    var m = String(h || '').match(/(ozon|alarm|spasibo-partners|spasibo-coupons)\.html/i);
    return m ? m[1].toLowerCase() : null;
  };
  var here = caseOf(location.pathname);
  var goalP = function (n, c) { try { window.ym(ID, 'reachGoal', n, c ? { 'кейс': c } : undefined); } catch (e) {} };

  /* Клик по кейсу: с главной и из «других кейсов» */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var c = caseOf(a.getAttribute('href'));
    if (!c || c === here) return;
    goalP(here ? 'next_case' : 'home_case_click', c);
  }, true);

  if (here) {
    /* Глубина дочитывания: 50% и 90% страницы */
    var hit = {};
    var onScroll = function () {
      var d = document.documentElement;
      var full = Math.max(d.scrollHeight, document.body ? document.body.scrollHeight : 0);
      if (full <= window.innerHeight * 1.2) return;
      var p = (window.scrollY + window.innerHeight) / full;
      if (p >= 0.5 && !hit[50]) { hit[50] = 1; goalP('case_read_50', here); }
      if (p >= 0.9 && !hit[90]) { hit[90] = 1; goalP('case_read_90', here); window.removeEventListener('scroll', onScroll); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Провели на кейсе больше минуты активного времени (вкладка открыта и на виду) */
    var spent = 0, tick = setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      spent += 5;
      if (spent >= 60) { clearInterval(tick); goalP('case_60s', here); }
    }, 5000);
  }

  /* Плашка про cookies */
  var KEY = 'jb-cookies-ok';
  try { if (window.localStorage.getItem(KEY)) return; } catch (e) {}

  var lang = (function () {
    try { var s = window.localStorage.getItem('jb-lang'); if (s === 'ru' || s === 'en') return s; } catch (e) {}
    var n = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^ru/i.test(n) ? 'ru' : 'en';
  })();
  var txt = lang === 'ru'
    ? { msg: 'Сайт использует cookies и Яндекс Метрику, чтобы понимать, какие кейсы читают.', ok: 'Понятно' }
    : { msg: 'This site uses cookies and Yandex Metrica to see which case studies get read.', ok: 'Got it' };

  var show = function () {
    var css = document.createElement('style');
    css.textContent =
      '.jb-ck{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;box-sizing:border-box;' +
      'width:calc(100% - 32px);max-width:560px;display:flex;align-items:center;gap:16px;padding:12px 12px 12px 20px;' +
      'background:#ffffff;color:#111111;border-radius:20px;box-shadow:0 8px 32px rgba(17,17,17,.12),0 0 0 1px rgba(17,17,17,.06);' +
      "font-family:'Inter Tight','Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.4;" +
      'animation:jbck .35s ease both}' +
      '.jb-ck p{margin:0;flex:1}' +
      '.jb-ck button{flex:none;height:40px;padding:0 18px;border:0;border-radius:30px;background:#2779FF;color:#fff;' +
      'font:inherit;font-weight:500;cursor:pointer}' +
      '.jb-ck button:hover{background:#1f6ae6}' +
      '@keyframes jbck{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}' +
      '@media (max-width:480px){.jb-ck{padding:12px 12px 12px 16px;gap:12px;font-size:13px}}';
    document.head.appendChild(css);
    var box = document.createElement('div');
    box.className = 'jb-ck';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'cookies');
    var p = document.createElement('p'); p.textContent = txt.msg;
    var b = document.createElement('button'); b.type = 'button'; b.textContent = txt.ok;
    b.addEventListener('click', function () {
      try { window.localStorage.setItem(KEY, '1'); } catch (e) {}
      box.parentNode && box.parentNode.removeChild(box);
    });
    box.appendChild(p); box.appendChild(b);
    document.body.appendChild(box);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
