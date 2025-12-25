(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const year = document.getElementById('year');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('navMenu');

  year.textContent = new Date().getFullYear();

  // Theme: prefer stored choice; fall back to system.
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  function setTheme(mode){
    if (mode === 'light') root.setAttribute('data-theme', 'light');
    else root.setAttribute('data-theme', 'dark');

    localStorage.setItem('theme', mode);
  }

  setTheme(stored || (prefersLight ? 'light' : 'dark'));

  themeBtn?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    setTheme(isLight ? 'dark' : 'light');
  });

  // Mobile nav
  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after click (mobile)
  navMenu?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    navMenu.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });

  // Small intersection observer reveal (subtle)
  const els = document.querySelectorAll('.card, .titem, .pill');
  const io = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (!ent.isIntersecting) continue;
      ent.target.classList.add('reveal');
      io.unobserve(ent.target);
    }
  }, { threshold: 0.12 });

  els.forEach(el => {
    el.classList.add('will-reveal');
    io.observe(el);
  });

  // Add reveal styles via CSS variables (no extra stylesheet)
  const style = document.createElement('style');
  style.textContent = `
    .will-reveal{opacity:0; transform: translateY(10px); transition: opacity .5s ease, transform .5s ease;}
    .reveal{opacity:1; transform: translateY(0);}
    @media (prefers-reduced-motion: reduce){
      .will-reveal{opacity:1; transform:none; transition:none;}
    }
  `;
  document.head.appendChild(style);
})();
