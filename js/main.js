/* ==========================================================================
   NURSING ON CALL - MAIN JAVASCRIPT CONFIGURATION & LOGIC
   Domain: nursingoncall.in
   Location: Bhiwadi / Dharuhera, India
   ========================================================================== */

// --------------------------------------------------------------------------
// BUSINESS INFORMATION & CONFIGURATION
// Easily change the phone number or WhatsApp message here.
// --------------------------------------------------------------------------
const CONFIG = {
  phoneDisplay: "+91 81685 75655",
  phoneRaw: "+918168575655",
  whatsappNumber: "918168575655", // Format: Country code without + followed by 10 digits
  defaultWaMessage: "Hello, I would like to know more about Nursing On Call services.",
  serviceAreas: ["Bhiwadi", "Dharuhera", "Gurugram", "Chopanki", "Rewari", "Bawal", "Nearby Areas"]
};

/**
 * Generate a WhatsApp URL with custom pre-filled message
 * @param {string} messageText 
 * @returns {string} wa.me URL
 */
function getWhatsAppUrl(messageText = CONFIG.defaultWaMessage) {
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedText}`;
}

// --------------------------------------------------------------------------
// INITIALIZATION ON DOM READY
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initFaqAccordion();
  initContactForm();
  updateDynamicLinks();
});

/**
 * Mobile Navigation Drawer Toggle & Scrolllock
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      const icon = toggleBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');

      const icon = toggleBtn.querySelector('svg');
      if (navMenu.classList.contains('is-active')) {
        document.body.style.overflow = 'hidden';
        if (icon) {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
        }
      } else {
        document.body.style.overflow = '';
        if (icon) {
          icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
        }
      }
    });

    // Close menu when clicking on any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-active')) {
          closeMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('is-active')) {
        closeMenu();
      }
    });
  }
}

/**
 * Interactive FAQ Accordion
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = question.nextElementSibling;
      const isOpen = faqItem.classList.contains('is-open');

      // Close all open FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('is-open');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // If clicked item wasn't open, open it
      if (!isOpen && answer) {
        faqItem.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Contact Page Enquiry Form Integration
 * Redirects user submission to pre-filled WhatsApp message
 */
function initContactForm() {
  const contactForm = document.getElementById('enquiryForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim();
    const phone = document.getElementById('formPhone')?.value.trim();
    const location = document.getElementById('formLocation')?.value.trim();
    const service = document.getElementById('formService')?.value;
    const message = document.getElementById('formMessage')?.value.trim();

    if (!name || !phone || !service) {
      alert('Please fill in your Name, Phone Number, and select a Service Required.');
      return;
    }

    const formattedMessage = 
`Hello Nursing On Call,

I would like to enquire about your services:
*Name:* ${name}
*Phone:* ${phone}
*Location:* ${location || 'Not specified'}
*Service Required:* ${service}
*Details:* ${message || 'N/A'}`;

    const waUrl = getWhatsAppUrl(formattedMessage);
    window.open(waUrl, '_blank');
  });
}

/**
 * Updates dynamic WhatsApp and Phone links across the DOM
 */
function updateDynamicLinks() {
  document.querySelectorAll('a[data-call-link]').forEach(link => {
    link.href = `tel:${CONFIG.phoneRaw}`;
  });

  document.querySelectorAll('a[data-wa-service]').forEach(btn => {
    const serviceName = btn.getAttribute('data-wa-service');
    const msg = `Hello, I would like information about ${serviceName} services for my home in Bhiwadi / Dharuhera area.`;
    btn.href = getWhatsAppUrl(msg);
  });
}
