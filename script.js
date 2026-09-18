const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav?.classList.toggle('is-open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 })
  : null;

document.querySelectorAll('.intro-section, .gallery-card, .report-copy, .package-card, .contact-intro, .contact-form').forEach((element) => {
  element.classList.add('reveal');
  revealObserver?.observe(element);
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

document.querySelector('[data-year]')?.replaceChildren(String(new Date().getFullYear()));

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const recipient = contactForm.dataset.mailto || 'contact@edsportshots.fr';
  const subject = `Projet photo — ${formData.get('project')}`;
  const body = [
    `Bonjour,`,
    ``,
    `Je m'appelle ${formData.get('name')}.`,
    `Mon adresse e-mail : ${formData.get('email')}.`,
    `Projet : ${formData.get('project')}.`,
    ``,
    String(formData.get('message')),
  ].join('\n');
  const status = contactForm.querySelector('[data-form-status]');
  if (status) status.textContent = 'Votre logiciel de messagerie va s’ouvrir…';
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

