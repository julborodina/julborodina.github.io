/* Наведение на карточку кейса: живая обложка чуть приподнимается */
(function () {
  function set(a, on) {
    var f = a.querySelector('iframe');
    try { if (f && f.contentDocument) f.contentDocument.documentElement.classList.toggle('hov', on); } catch (e) {}
  }
  document.addEventListener('mouseover', function (e) { var a = e.target.closest && e.target.closest('a.case'); if (a && !a.contains(e.relatedTarget)) set(a, true); });
  document.addEventListener('mouseout', function (e) { var a = e.target.closest && e.target.closest('a.case'); if (a && !a.contains(e.relatedTarget)) set(a, false); });
})();
