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

  function initChatbot() {
    var fab = document.getElementById('pti-fab');
    var panel = document.getElementById('pti-panel');
    var closeBtn = document.getElementById('pti-close');
    var input = document.getElementById('pti-input');
    var msgs = document.getElementById('pti-msgs');
    if (!fab || !panel) return;

    var open = false, history = [];

    function show() { open=true; panel.style.display='flex'; document.getElementById('pti-icon').style.opacity='0'; document.getElementById('pti-x').style.opacity='1'; setTimeout(function(){input.focus();},300); }
    function hide() { open=false; panel.style.display='none'; document.getElementById('pti-icon').style.opacity='1'; document.getElementById('pti-x').style.opacity='0'; }
    function addMsg(text, role) {
      var d = document.createElement('div');
      d.className = 'pti-msg-el';
      d.style.cssText = role==='user'
        ? 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 14px;border-radius:14px 4px 14px 14px;font-size:13px;line-height:1.6;max-width:85%;align-self:flex-end;'
        : 'background:#1e293b;color:rgba(255,255,255,.85);padding:12px 14px;border-radius:4px 14px 14px 14px;font-size:13px;line-height:1.6;max-width:85%;';
      d.textContent = text; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
    function typing() {
      var d = document.createElement('div'); d.id='pti-typing';
      d.style.cssText='background:#1e293b;padding:12px 14px;border-radius:4px 14px 14px 14px;display:flex;gap:5px;align-items:center;';
      d.innerHTML='<span class="pti-dot"></span><span class="pti-dot"></span><span class="pti-dot"></span>';
      msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
    }
    async function send() {
      var text = input.value.trim(); if(!text) return;
      input.value = ''; addMsg(text,'user'); history.push({role:'user',content:text}); typing();
      try {
        var r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,conversationHistory:history})});
        var data = await r.json();
        var t=document.getElementById('pti-typing'); if(t) t.remove();
        if(data.conversationHistory) history=data.conversationHistory;
        addMsg(data.response||"Sorry, something went wrong.",'bot');
      } catch(e) { var t=document.getElementById('pti-typing'); if(t) t.remove(); addMsg("Connection issue. Try again!",'bot'); }
    }

    fab.addEventListener('click', function(){ open ? hide() : show(); });
    closeBtn.addEventListener('click', hide);
    input.addEventListener('keydown', function(e){ if(e.key==='Enter') send(); });

    // Chips
    document.querySelectorAll('[data-pti-quick]').forEach(function(btn){
      btn.addEventListener('click', function(){ input.value=btn.getAttribute('data-pti-quick'); send(); });
    });

    // Send button
    var sendBtn = document.getElementById('pti-send');
    if(sendBtn) sendBtn.addEventListener('click', send);
  }
    // Inject responsive CSS into <head> — guaranteed to apply on all browsers
    const css = document.createElement('style');
    css.textContent = '@media(max-width:767px){#desktopNav{display:none!important;}#mobileMenuBtn{display:flex!important;}}';
    document.head.appendChild(css);

    // Dropdown (desktop)
    document.body.addEventListener('click', function(e) {
      if (e.target.closest('#solutions-arrow')) {
        e.stopPropagation();
        const menu = document.getElementById('solutions-menu');
        const chev = document.getElementById('solutions-chevron');
        if (menu) {
          const open = menu.style.opacity === '1';
          menu.style.opacity = open ? '0' : '1';
          menu.style.pointerEvents = open ? 'none' : 'all';
          menu.style.transform = open ? 'translateY(8px)' : 'translateY(0)';
          if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
        }
        return;
      }
      if (!e.target.closest('#solutions-dropdown-wrap')) {
        const menu = document.getElementById('solutions-menu');
        const chev = document.getElementById('solutions-chevron');
        if (menu) { menu.style.opacity='0'; menu.style.pointerEvents='none'; menu.style.transform='translateY(8px)'; }
        if (chev) chev.style.transform = '';
      }
    });

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('main-nav');
      if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.5)' : 'none';
    });

    setTimeout(() => {
      const path = window.location.pathname;
      const map = {'/':['nav-home','nav-mobile-home'],'/about':['nav-about','nav-mobile-about'],'/contact':['nav-contact','nav-mobile-contact'],'/our-solutions':['nav-solutions','nav-mobile-solutions']};
      Object.keys(map).forEach(p => {
        if (path === p || path === p + '.html') map[p].forEach(id => { const el = document.getElementById(id); if (el) { el.style.color='#60a5fa'; el.style.fontWeight='600'; } });
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
      while (d.firstChild) document.body.appendChild(d.firstChild);
      // Init chatbot after DOM is ready
      initChatbot();
    }).catch(e => console.warn('chatbot failed', e));
  });
})();
