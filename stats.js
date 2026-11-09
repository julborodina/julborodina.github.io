/* Статистика: GoatCounter, без cookies. Пока код пустой, ничего не отправляется. */
(function () {
  var GC = 'jdborodina'; // например 'jdborodina' → https://jdborodina.goatcounter.com
  if (!GC) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + GC + '.goatcounter.com/count');
  document.head.appendChild(s);

  /* Событие в GoatCounter; до загрузки скрипта копим в очередь */
  var queue = [];
  var send = function (name) {
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
    else queue.push(name);
  };
  var flush = setInterval(function () {
    if (window.goatcounter && window.goatcounter.count) { clearInterval(flush); while (queue.length) send(queue.shift()); }
  }, 500);
  setTimeout(function () { clearInterval(flush); }, 15000);

  /* Главная уже вызывает window.ym(JB_YM, 'reachGoal', имя): перенаправляем в GoatCounter */
  window.JB_YM = 1;
  window.ym = function (id, act, name) { if (act === 'reachGoal' && name) send(name); };

  var caseOf = function (h) {
    var m = String(h || '').match(/(ozon|alarm|spasibo-partners|spasibo-coupons)\.html/i);
    return m ? m[1].toLowerCase() : null;
  };
  var here = caseOf(location.pathname);

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var c = caseOf(h);
    if (c && c !== here) { send((here ? 'next-case-' : 'open-case-') + c); return; }
    if (!here) return; /* контакты на главной отправляет сама страница */
    if (/cv\/.*\.pdf/i.test(h)) send('contact_cv');
    else if (/t\.me\//i.test(h)) send('contact_tg');
    else if (/^mailto:/i.test(h)) send('contact_mail');
  }, true);

  if (here) {
    var hit = {};
    var onScroll = function () {
      var d = document.documentElement;
      var full = Math.max(d.scrollHeight, document.body ? document.body.scrollHeight : 0);
      if (full <= window.innerHeight * 1.2) return;
      var p = (window.scrollY + window.innerHeight) / full;
      if (p >= 0.5 && !hit[50]) { hit[50] = 1; send('read-50-' + here); }
      if (p >= 0.9 && !hit[90]) { hit[90] = 1; send('read-90-' + here); window.removeEventListener('scroll', onScroll); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    var spent = 0, tick = setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      spent += 5;
      if (spent >= 60) { clearInterval(tick); send('minute-' + here); }
    }, 5000);
  }
})();
