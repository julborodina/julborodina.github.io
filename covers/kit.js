/* Общая логика живых обложек: язык, масштаб сцены, пауза вне экрана, одна прорисовка пометки */
window.Cover = function (o) {
  var root = document.documentElement;
  var lg = /[?&]lang=en/.test(location.search) ? 'en' : 'ru';
  root.lang = lg;
  [].forEach.call(document.querySelectorAll('[data-ru]'), function (el) { el.textContent = el.getAttribute('data-' + lg) || el.getAttribute('data-ru'); });
  [].forEach.call(document.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src').replace('{lg}', lg); });

  var st = document.querySelector('.st');
  var hero = /[?&]hero=1/.test(location.search);   /* обложка стоит первой картинкой внутри кейса, без плашки */
  function fit() {
    var W = window.innerWidth, H = window.innerHeight, m = W <= 480;
    var s = Math.max(W / o.w, H / o.h) * (m && o.mZoom ? o.mZoom : 1);
    var panel = hero ? 0 : (m ? 150 : 106);                     /* белая плашка с названием кейса внизу карточки */
    var up = 0;
    var keep = m && o.keepM ? o.keepM : o.keep;
    if (keep) up = Math.max(0, keep * s + 8 - (H - panel));   /* что должно остаться над плашкой */
    if (hero && o.box) up = (o.box[0] + o.box[1]) / 2 * s - H / 2;   /* внутри кейса центрируем композицию */
    var x = (W - o.w * s) / 2 + (m && o.mShift ? o.mShift * s : 0);
    st.style.transform = 'translate(' + x + 'px,' + (-up) + 'px) scale(' + s + ')';
  }
  fit(); window.addEventListener('resize', fit);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false, drawn = false;
  function sync() {
    var on = seen && !document.hidden;
    root.classList.toggle('paused', !on);
    if (on && !drawn) { drawn = true; setTimeout(function () { root.classList.add('drawn'); }, reduce ? 0 : 500); }
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { seen = e[0].isIntersecting; sync(); }, { threshold: 0.35 }).observe(document.body);
  else { seen = true; sync(); }
  document.addEventListener('visibilitychange', sync);
};
