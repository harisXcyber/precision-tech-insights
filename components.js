(function () {
  'use strict';

  function initChatbot() {
    var fab = document.getElementById('pti-fab');
    var panel = document.getElementById('pti-panel');
    var closeBtn = document.getElementById('pti-close');
    var input = document.getElementById('pti-input');
    var msgs = document.getElementById('pti-msgs');
    var sendBtn = document.getElementById('pti-send');
    if (!fab || !panel) return;

    var open = false;
    var history = [];

    function show() {
      open = true;
      panel.style.display = 'flex';
      var icon = document.getElementById('pti-icon');
      var x = document.getElementById('pti-x');
      if (icon) icon.style.opacity = '0';
      if (x) x.style.opacity = '1';
      setTimeout(function () { if (input) input.focus(); }, 300);
    }
    function hide() {
      open = false;
      panel.style.display = 'none';
      var icon = document.getElementById('pti-icon');
      var x = document.getElementById('pti-x');
      if (icon) icon.style.opacity = '1';
      if (x) x.style.opacity = '0';
    }
    function addMsg(text, role) {
      var d = document.createElement('div');
      d.className = 'pti-msg-el';
      d.style.cssText = role === 'user'
        ? 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 14px;border-radius:14px 4px 14px 14px;font-size:13px;line-height:1.6;max-width:85%;align-self:flex-end;'
        : 'background:#1e293b;color:rgba(255,255,255,.85);padding:12px 14px;border-radius:4px 14px 14px 14px;font-size:13px;line-height:1.6;max-width:85%;';
      d.textContent = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function showTyping() {
      var d = document.createElement('div');
      d.id = 'pti-typing';
      d.style.cssText = 'background:#1e293b;padding:12px 14px;border-radius:4px 14px 14px 14px;display:flex;gap:5px;align-items:center;';
      d.innerHTML = '<span class="pti-dot"></span><span class="pti-dot"></span><span class="pti-dot"></span>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function send() {
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      addMsg(text, 'user');
      history.push({ role: 'user', content: text });
      showTyping();
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory: history })
      }).then(function (r) { return r.json(); }).then(function (data) {
        var t = document.getElementById('pti-typing'); if (t) t.remove();
        if (data.conversationHistory) history = data.conversationHistory;
        addMsg(data.response || 'Sorry, something went wrong.', 'bot');
      }).catch(function () {
        var t = document.getElementById('pti-typing'); if (t) t.remove();
        addMsg('Connection issue. Please try again!', 'bot');
      });
    }

    fab.addEventListener('click', function () { open ? hide() : show(); });
    if (closeBtn) closeBtn.addEventListener('click', hide);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
    if (sendBtn) sendBtn.addEventListener('click', send);
    document.querySelectorAll('[data-pti-quick]').forEach(function (btn) {
      btn.addEventListener('click', function () { input.value = btn.getAttribute('data-pti-quick'); send(); });
    });
  }

  function initNavbar() {
    var css = document.createElement('style');
    css.textContent = '@media(max-width:767px){#desktopNav{display:none!important;}#mobileMenuBtn{display:flex!important;}}';
    document.head.appendChild(css);

    document.body.addEventListener('click', function (e) {
      if (e.target.closest('#solutions-arrow')) {
        e.stopPropagation();
        var menu = document.getElementById('solutions-menu');
        var chev = document.getElementById('solutions-chevron');
        if (menu) {
          var isOpen = menu.style.opacity === '1';
          menu.style.opacity = isOpen ? '0' : '1';
          menu.style.pointerEvents = isOpen ? 'none' : 'all';
          menu.style.transform = isOpen ? 'translateY(8px)' : 'translateY(0)';
          if (chev) chev.style.transform = isOpen ? '' : 'rotate(180deg)';
        }
        return;
      }
      if (!e.target.closest('#solutions-dropdown-wrap')) {
        var menu = document.getElementById('solutions-menu');
        if (menu) { menu.style.opacity = '0'; menu.style.pointerEvents = 'none'; menu.style.transform = 'translateY(8px)'; }
        var chev = document.getElementById('solutions-chevron');
        if (chev) chev.style.transform = '';
      }
    });

    window.addEventListener('scroll', function () {
      var nav = document.getElementById('main-nav');
      if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.5)' : 'none';
    });

    setTimeout(function () {
      var path = window.location.pathname;
      var map = { '/': ['nav-home', 'nav-mobile-home'], '/about': ['nav-about', 'nav-mobile-about'], '/contact': ['nav-contact', 'nav-mobile-contact'], '/our-solutions': ['nav-solutions', 'nav-mobile-solutions'] };
      Object.keys(map).forEach(function (p) {
        if (path === p || path === p + '.html') {
          map[p].forEach(function (id) { var el = document.getElementById(id); if (el) { el.style.color = '#60a5fa'; el.style.fontWeight = '600'; } });
        }
      });
    }, 400);
  }

  function run() {
    initNavbar();

    fetch('/navbar.html').then(function (r) { return r.text(); }).then(function (html) {
      var c = document.getElementById('navbar-container');
      if (c) { c.innerHTML = html; } else {
        var d = document.createElement('div');
        d.id = 'navbar-container'; d.innerHTML = html;
        document.body.insertBefore(d, document.body.firstChild);
      }
    }).catch(function (e) { console.warn('navbar failed', e); });

    fetch('/footer.html').then(function (r) { return r.text(); }).then(function (html) {
      var c = document.getElementById('footer-container');
      if (c) { c.innerHTML = html; } else {
        var d = document.createElement('div'); d.innerHTML = html;
        document.body.appendChild(d);
      }
    }).catch(function (e) { console.warn('footer failed', e); });

    var existing = document.getElementById('chatbot-container');
    if (existing) existing.remove();
    fetch('/chatbot.html').then(function (r) { return r.text(); }).then(function (html) {
      var d = document.createElement('div');
      d.innerHTML = html;
      while (d.firstChild) document.body.appendChild(d.firstChild);
      initChatbot();
    }).catch(function (e) { console.warn('chatbot failed', e); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}());
