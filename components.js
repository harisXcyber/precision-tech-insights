/**
 * components.js — shared layout loader for Precision Tech Insights
 * Injects navbar, footer, and AI chatbot into every page automatically.
 * To update header/footer/chatbot: edit navbar.html, footer.html, or chatbot.html only.
 */
(function () {
  function inject(url, containerId, append = false) {
    return fetch(url)
      .then(r => r.text())
      .then(html => {
        if (append) {
          const div = document.createElement('div');
          div.innerHTML = html;
          document.body.appendChild(div.firstElementChild || div);
        } else {
          const el = document.getElementById(containerId);
          if (el) el.innerHTML = html;
        }
      })
      .catch(e => console.warn('Component load failed:', url, e));
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Navbar — inject into #navbar-container if present, else prepend to body
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
      inject('/navbar.html', 'navbar-container');
    } else {
      fetch('/navbar.html').then(r => r.text()).then(html => {
        const div = document.createElement('div');
        div.id = 'navbar-container';
        div.innerHTML = html;
        document.body.insertBefore(div, document.body.firstChild);
      });
    }

    // Footer — inject into #footer-container if present, else append to body
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      inject('/footer.html', 'footer-container');
    } else {
      fetch('/footer.html').then(r => r.text()).then(html => {
        const div = document.createElement('div');
        div.id = 'footer-container';
        div.innerHTML = html;
        document.body.appendChild(div);
      });
    }

    // Chatbot — always append, remove any existing inline chatbot first
    const existing = document.getElementById('chatbot-container');
    if (existing) existing.remove();
    fetch('/chatbot.html').then(r => r.text()).then(html => {
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div.firstElementChild || div);
    });
  });
})();
