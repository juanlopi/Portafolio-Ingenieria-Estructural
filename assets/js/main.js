const body = document.body;
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".site-nav a");
const progress = document.querySelector(".scroll-progress");
const lightbox = document.querySelector(".lightbox");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const open = body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

function updateProgress() {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function openLightbox(image, caption) {
  if (!lightbox || !image) return;
  const targetImage = lightbox.querySelector("img");
  const targetCaption = lightbox.querySelector("p");
  targetImage.src = image.currentSrc || image.src;
  targetImage.alt = image.alt || "";
  targetCaption.textContent = caption || image.alt || "";
  lightbox.showModal();
}

document.querySelectorAll("[data-lightbox]").forEach((element) => {
  element.addEventListener("click", () => {
    const image = element.querySelector("img");
    const caption = element.querySelector("figcaption, .figure-copy")?.textContent.trim();
    openLightbox(image, caption);
  });
});

if (lightbox) {
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

window.portfolioLightbox = openLightbox;
