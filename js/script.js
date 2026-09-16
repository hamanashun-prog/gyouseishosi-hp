// モバイルメニューの開閉
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
  };
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // メニュー内のリンクを押したら自動で閉じる
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
}

document.querySelectorAll('[data-service]').forEach((card) => {
  const label = card.querySelector('.card-more');
  if (label) label.firstChild.textContent = 'この業務について相談する';
  card.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (service) service.value = card.dataset.service;
  });
});

// お問い合わせフォーム（現状はサンプル動作のみ）
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('このフォームはデザインのサンプルです。実際に送信できるようにするには、フォーム送信サービスとの連携が必要です。');
  });
}
