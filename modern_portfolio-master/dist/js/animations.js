document.addEventListener('DOMContentLoaded', () => {
  // Page loader animation
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    // Hide loader after content is loaded
    setTimeout(() => {
      pageLoader.classList.add('fade-out');
    }, 1500);
  }
  
  // Animate elements when they come into view
  const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-stagger');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all contact items and flip cards
    document.querySelectorAll('.contact-item, .flip-card, .contact-card').forEach(item => {
      observer.observe(item);
    });
  };
  
  // Initialize intersection observer if supported
  if ('IntersectionObserver' in window) {
    observeElements();
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('.contact-item, .flip-card, .contact-card').forEach(item => {
      item.classList.add('animate-stagger');
    });
  }
  
  // Add custom hover effects for contact items
  const contactItems = document.querySelectorAll('.contact-item');
  
  contactItems.forEach(item => {
    const icon = item.querySelector('.contact-icon i');
    const originalIcon = icon ? icon.className : '';
    
    item.addEventListener('mouseenter', () => {
      // Add subtle icon animation
      if (icon) {
        icon.classList.add('fa-beat');
      }
    });
    
    item.addEventListener('mouseleave', () => {
      // Remove animation
      if (icon) {
        icon.classList.remove('fa-beat');
        // Reset icon class
        setTimeout(() => {
          icon.className = originalIcon;
        }, 300);
      }
    });
  });
  
  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    // Show button when scrolled down
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Form submission animation
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector('.btn-submit');
      const originalText = submitButton.innerHTML;
      
      // Change button text and add loading class
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.classList.add('loading');
      submitButton.disabled = true;
      
      // Simulate form submission (replace with actual form submission)
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitButton.classList.remove('loading');
        submitButton.classList.add('success');
        
        // Reset form
        contactForm.reset();
        
        // Restore original button after delay
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.classList.remove('success');
          submitButton.disabled = false;
        }, 3000);
      }, 2000);
    });
  }
  
  // Add hover effects for form inputs
  const formControls = document.querySelectorAll('.form-control');
  
  formControls.forEach(control => {
    control.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    control.addEventListener('blur', function() {
      if (this.value === '') {
        this.parentElement.classList.remove('focused');
      }
    });
  });
});
