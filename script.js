(() => {

  const button = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  if (!button || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    button.classList.toggle("is-active", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  };

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = !menu.classList.contains("is-open");
    setOpen(open);
  });

  /* Close menu when clicking outside */

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || button.contains(e.target)) return;
    setOpen(false);
  });

  /* Escape key closes menu */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  });

  /* Close menu after clicking a link */

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      setOpen(false);
    });
  });

})();

/* Footer year */

document.querySelectorAll("[data-current-year]").forEach(year => {
  year.textContent = new Date().getFullYear();
});

/* Sticky header scroll effect */

const header = document.querySelector(".header");
let headerScrolled = false;
let scrollTicking = false;

const updateHeader = () => {
  const shouldShrink = headerScrolled
    ? window.scrollY > 8
    : window.scrollY > 28;

  if (shouldShrink !== headerScrolled) {
    headerScrolled = shouldShrink;
    header.classList.toggle("header-scrolled", headerScrolled);
  }

  scrollTicking = false;
};

window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateHeader);
}, { passive: true });

updateHeader();

/* Contact form email */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const contactThankYou = document.getElementById("contact-thank-you");
const sendAnotherMessage = document.getElementById("send-another-message");
const contactFormArea = document.querySelector(".contact-form-area");

if (contactForm && formStatus && contactThankYou && sendAnotherMessage && contactFormArea && window.emailjs) {
  emailjs.init("l0NsaPaexJ-beDREm");

  const holdFormHeight = () => {
    if (!contactForm.hidden) {
      contactFormArea.style.minHeight = `${contactForm.offsetHeight}px`;
    }
  };

  holdFormHeight();
  window.addEventListener("resize", holdFormHeight);

  contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    formStatus.innerText = "Sending...";
    contactForm.classList.add("is-sending");
    holdFormHeight();

    emailjs.sendForm(
      "service_bqgak0x",
      "template_lex5qhc",
      this
    ).then(function() {
      contactForm.reset();
      formStatus.innerText = "";
      contactForm.hidden = true;
      contactThankYou.hidden = false;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, function(error) {
      formStatus.innerText = "Failed to send message. Please try again.";
      console.error("EmailJS Error:", error);
    }).finally(function() {
      contactForm.classList.remove("is-sending");
    });
  });

  sendAnotherMessage.addEventListener("click", function() {
    contactThankYou.hidden = true;
    contactForm.hidden = false;
    formStatus.innerText = "";
    holdFormHeight();
    contactForm.querySelector("input, textarea").focus();
  });
}
