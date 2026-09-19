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

// お問い合わせフォーム（FormSubmitのAJAXエンドポイント経由でメール送信）
const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/hamana.gyouseishoshi@gmail.com';
const CONTACT_FALLBACK_MAIL = 'hamana.gyouseishoshi@gmail.com';
const contactForm = document.getElementById('contact-form');
const contactStatus = contactForm && contactForm.querySelector('.contact-status');

if (contactForm && contactStatus) {
  const submitButton = contactForm.querySelector('[type="submit"]');
  const submitLabel = submitButton.textContent;

  const showStatus = (message, isError) => {
    contactStatus.textContent = message;
    contactStatus.classList.toggle('is-error', isError);
    contactStatus.hidden = false;
    contactStatus.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const payload = {
      _subject: data.get('_subject'),
      _template: data.get('_template'),
      _captcha: 'false',
      _honey: data.get('_honey'),
      'お名前': data.get('name'),
      email: data.get('email'),
      '電話番号': data.get('tel') || '（未入力）',
      'ご相談内容': contactForm.elements.service.selectedOptions[0].textContent,
      'お問い合わせ内容': data.get('message'),
    };

    submitButton.disabled = true;
    submitButton.textContent = '送信中…';
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || String(result.success) === 'false') {
        throw new Error(result.message || response.statusText);
      }
      contactForm.reset();
      showStatus('お問い合わせを送信しました。内容を確認のうえ、改めてご連絡いたします。', false);
    } catch (error) {
      showStatus(`送信できませんでした。お手数ですが、時間をおいて再度お試しいただくか、${CONTACT_FALLBACK_MAIL} まで直接メールでご連絡ください。`, true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitLabel;
    }
  });
}
