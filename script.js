// ----- PROJECT CAROUSEL -----
// Get the carousel elements
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;

// Create navigation dots for each project
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => moveToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(document.querySelectorAll('.dot'));

// Update which dot is active
const updateDots = (index) => {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
};

// Move to a specific slide (with wrap-around)
const moveToSlide = (index) => {
  // Loop back if at start or end
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  
  // Slide the track
  track.style.transform = `translateX(-${index * 100}%)`;
  updateDots(index);
  currentIndex = index;

  // Replay the folder open animation on the new slide
  slides.forEach(slide => slide.style.animation = 'none');
  slides[index].offsetHeight; // force browser to reflow
  slides[index].style.animation = 'folderOpen 0.4s ease-out';
};

// Previous / next buttons
prevButton.addEventListener('click', () => {
  moveToSlide(currentIndex - 1);
});

nextButton.addEventListener('click', () => {
  moveToSlide(currentIndex + 1);
});


// ----- SMOOTH SCROLLING FOR ALL ANCHOR LINKS -----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ----- HIGHLIGHT ACTIVE NAVIGATION LINK ON SCROLL (STABLE) -----
const sections = document.querySelectorAll('#home, #skills, #learning, #projects, #footer');
const navLinks = document.querySelectorAll('.nav-link');

// Find which section is currently most visible (largest intersection area)
const getTopmostVisibleSection = () => {
  let topmost = null;
  let minDistance = Infinity;
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Section is visible, get distance from top of viewport
      const distance = Math.abs(rect.top);
      if (distance < minDistance) {
        minDistance = distance;
        topmost = section;
      }
    }
  });
  return topmost;
};

// Update active link based on topmost visible section
const updateActiveLink = () => {
  const activeSection = getTopmostVisibleSection();
  if (activeSection) {
    const id = activeSection.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
  }
};

// Listen to scroll and resize events (with requestAnimationFrame for performance)
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveLink();
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener('resize', updateActiveLink);
updateActiveLink(); // initial call