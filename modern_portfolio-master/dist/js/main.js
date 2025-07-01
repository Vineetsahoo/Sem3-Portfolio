// Select DOM Items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');
const backToTop = document.querySelector('.back-to-top');

// Set Initial State Of Menu
let showMenu = false;

// Event Listeners
menuBtn.addEventListener('click', toggleMenu);
document.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', initializeAnimations);

// Toggle Menu Function
function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    menuBranding.classList.add('show');
    navItems.forEach(item => item.classList.add('show'));

    // Set Menu State
    showMenu = true;
  } else {
    menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    menuBranding.classList.remove('show');
    navItems.forEach(item => item.classList.remove('show'));

    // Set Menu State
    showMenu = false;
  }
}

// Handle Scroll Function
function handleScroll() {
  // Back to top button
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
  
  // Animate elements on scroll
  const scrollElements = document.querySelectorAll('.scroll-animation');
  
  scrollElements.forEach(element => {
    if (isElementInViewport(element)) {
      element.classList.add('animate');
    }
  });
}

// Check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
  );
}

// Initialize animations
function initializeAnimations() {
  // Set up skill bars
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    const percentage = bar.getAttribute('data-percentage');
    bar.style.width = percentage;
  });
  
  // Add scroll animation class to elements
  const animatedElements = document.querySelectorAll('.about-info, .projects, .boxes, .skills, .testimonials');
  animatedElements.forEach(element => {
    element.classList.add('scroll-animation');
  });
  
  // Add Back to Top functionality
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Close menu if it's open
      if (showMenu) {
        toggleMenu();
      }
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Type writer effect for home page
  const typeWriterElement = document.querySelector('.typewriter');
  if (typeWriterElement) {
    const text = typeWriterElement.getAttribute('data-text');
    const delay = typeWriterElement.getAttribute('data-delay') || 100;
    
    if (text) {
      typeWriter(typeWriterElement, text.split(','), delay);
    }
  }
}

// Typewriter effect
function typeWriter(element, textArray, delay = 100) {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
      // Deleting text
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Typing text
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    // Move to next text or start deleting
    if (!isDeleting && charIndex === currentText.length) {
      // Pause at end of word
      setTimeout(() => {
        isDeleting = true;
      }, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % textArray.length;
    }
    
    // Typing speed
    let typeSpeed = delay;
    if (isDeleting) typeSpeed /= 2;
    
    setTimeout(type, typeSpeed);
  }
  
  // Start the typing effect
  setTimeout(type, 1000);
}
