// Carousel functionality
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => moveToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(document.querySelectorAll('.dot'));

const updateDots = (index) => {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
};

const moveToSlide = (index) => {
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  track.style.transform = `translateX(-${index * 100}%)`;
  updateDots(index);
  currentIndex = index;

  // Re-trigger animation
  slides.forEach(slide => slide.style.animation = 'none');
  slides[index].offsetHeight; // force reflow
  slides[index].style.animation = 'folderOpen 0.4s ease-out';
};

prevButton.addEventListener('click', () => {
  moveToSlide(currentIndex - 1);
});

nextButton.addEventListener('click', () => {
  moveToSlide(currentIndex + 1);
});

// Smooth scrolling for anchor links (including nav)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Section navigation active state (Intersection Observer)
const sections = document.querySelectorAll('#hero, #skills, #learning, #projects, #footer');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3 // when 30% of section is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

// Set initial active on page load (if any section is already visible)
// The observer will handle it, but we can trigger a quick check
window.addEventListener('load', () => {
  // Find the section that is most visible
  let maxVisible = 0;
  let activeId = null;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (visibleHeight > maxVisible) {
      maxVisible = visibleHeight;
      activeId = section.getAttribute('id');
    }
  });
  if (activeId) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }
});