/**
 * components.js — shared layout loader for Precision Tech Insights
 * Edit navbar.html, footer.html, or chatbot.html to update all pages at once.
 */
(function () {
  function loadHTML(url, callback) {
    fetch(url).then(r => r.text()).then(callback).catch(e => console.warn('Component load failed:', url, e));
  }

  function execScripts(container) {
    container.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      if (old.src) { s.src = old.src; } else { s.textContent = old.textContent; }
      document.head.appendChild(s);
      old.remove();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Navbar
    const navEl = document.getElementById('navbar-container');
    if (navEl && !navEl.innerHTML.trim()) {
      loadHTML('/navbar.html', html => { navEl.innerHTML = html; execScripts(navEl); });
    }

    // Footer
    const footerEl = document.getElementById('footer-container');
    if (footerEl) {
      loadHTML('/footer.html', html => { footerEl.innerHTML = html; });
    } else {
      loadHTML('/footer.html', html => {
        const div = document.createElement('div');
        div.id = 'footer-container';
        div.innerHTML = html;
        document.body.appendChild(div);
      });
    }

    // Chatbot — remove any existing inline one, then inject canonical
    const existing = document.getElementById('chatbot-container');
    if (existing) existing.remove();
    loadHTML('/chatbot.html', html => {
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div);
      execScripts(div);
    });
  });
})();
