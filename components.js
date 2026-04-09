/**
 * components.js — shared layout loader for Precision Tech Insights
 */
(function () {
  function runScripts(container) {
    container.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }

  function initNavbar() {
    // Event delegation on body — works regardless of injection timing
    document.body.addEventListener('click', function(e) {
      if (e.target.closest('#mobileMenuBtn')) {
        const mob = document.getElementById('mobileMenu');
        if (mob) mob.style.display = mob.style.display === 'none' ? 'block' : 'none';
        return;
      }
      if (e.target.closest('#solutions-arrow')) {
        e.stopPropagation();
        const menu = document.getElementById('solutions-menu');
        const chev = document.getElementById('solutions-chevron');
        if (menu) { const open = menu.classList.toggle('open'); if (chev) chev.style.transform = open ? 'rotate(180deg)' : ''; }
        return;
      }
      if (!e.target.closest('#solutions-dropdown-wrap')) {
        const menu = document.getElementById('solutions-menu');
        const chev = document.getElementById('solutions-chevron');
        if (menu) { menu.classList.remove('open'); if (chev) chev.style.transform = ''; }
      }
    });
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('main-nav');
      if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.4)' : 'none';
    });
    setTimeout(() => {
      const path = window.location.pathname;
      const map = {'/':['nav-home','nav-mobile-home'],'/about':['nav-about','nav-mobile-about'],'/contact':['nav-contact','nav-mobile-contact'],'/our-solutions':['nav-solutions','nav-mobile-solutions']};
      Object.keys(map).forEach(p => {
        if (path === p || path === p + '.html') map[p].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('text-accent','font-semibold'); });
      });
    }, 400);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar(); // Set up delegation immediately — no need to wait for injection

    fetch('/navbar.html').then(r => r.text()).then(html => {
      const c = document.getElementById('navbar-container');
      if (c) { c.innerHTML = html; } else {
        const d = document.createElement('div');
        d.id = 'navbar-container'; d.innerHTML = html;
        document.body.insertBefore(d, document.body.firstChild);
      }
    }).catch(e => console.warn('navbar failed', e));

    fetch('/footer.html').then(r => r.text()).then(html => {
      const c = document.getElementById('footer-container');
      if (c) { c.innerHTML = html; } else {
        const d = document.createElement('div'); d.innerHTML = html;
        document.body.appendChild(d);
      }
    }).catch(e => console.warn('footer failed', e));

    const existing = document.getElementById('chatbot-container');
    if (existing) existing.remove();
    fetch('/chatbot.html').then(r => r.text()).then(html => {
      const d = document.createElement('div');
      d.innerHTML = html;
      document.body.appendChild(d.firstElementChild || d);
      runScripts(d);
    }).catch(e => console.warn('chatbot failed', e));
  });
})();
