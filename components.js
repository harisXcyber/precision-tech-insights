/**
 * components.js — shared layout loader for Precision Tech Insights
 */
(function () {
  function injectHTML(html, container, prepend) {
    const div = document.createElement('div');
    div.innerHTML = html;
    if (container) {
      container.innerHTML = '';
      container.appendChild(div.firstElementChild || div);
    } else if (prepend) {
      document.body.insertBefore(div, document.body.firstChild);
    } else {
      document.body.appendChild(div);
    }
    // Re-execute any <script> tags (innerHTML doesn't run them)
    (container || div).querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      if (old.src) s.src = old.src; else s.textContent = old.textContent;
      document.head.appendChild(s);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    fetch('/navbar.html').then(r => r.text()).then(html => {
      injectHTML(html, document.getElementById('navbar-container'), true);
    }).catch(e => console.warn('navbar load failed', e));

    fetch('/footer.html').then(r => r.text()).then(html => {
      injectHTML(html, document.getElementById('footer-container'), false);
    }).catch(e => console.warn('footer load failed', e));

    const existing = document.getElementById('chatbot-container');
    if (existing) existing.remove();
    fetch('/chatbot.html').then(r => r.text()).then(html => {
      injectHTML(html, null, false);
    }).catch(e => console.warn('chatbot load failed', e));
  });
})();
