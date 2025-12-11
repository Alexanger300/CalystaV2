// Menu hamburger
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');

hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fermer le menu quand on clique sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Header sticky : transparent sur le hero, violet après
window.addEventListener('scroll', () => {
    if (!header || !hero) return;
    const threshold = Math.max(hero.offsetHeight - header.offsetHeight, 0);
    if (window.scrollY > threshold) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Carrousel des packs
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('packCarousel');
  const dots = document.querySelectorAll('#packDots .dot');
  const prevBtn = document.getElementById('packPrevBtn');
  const nextBtn = document.getElementById('packNextBtn');
  let currentIndex = 0;

  if (carousel && dots.length > 0) {
    // On calcule la translation de manière directe en utilisant la position
    // réelle de la slide cible (offsetLeft). Cela évite tout décalage causé
    // par padding/marges/gap ou différence entre largeur du conteneur et
    // largeur effective d'un item.
    function updateCarousel(index) {
      const slides = carousel.querySelectorAll('.pack-item');
      if (!slides.length) return;
      const target = slides[index];
      if (!target) return;

      currentIndex = index;
      // offsetLeft donne la position du slide par rapport à l'élément offsetParent
      // (ici le carousel en flex). C'est la distance exacte à traduire.
      const shift = target.offsetLeft;
      carousel.style.transform = `translateX(-${shift}px)`;

      dots.forEach((dot, i) => {
        if (i === index) dot.classList.add('active');
        else dot.classList.remove('active');
      });
      
      // Gestion de la visibilité des boutons
      if (prevBtn && nextBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex === slides.length - 1 ? 'default' : 'pointer';
      }
    }

    // Navigation avec les dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateCarousel(index);
      });
    });

    // Navigation avec les boutons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          updateCarousel(currentIndex - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const slides = carousel.querySelectorAll('.pack-item');
        if (currentIndex < slides.length - 1) {
          updateCarousel(currentIndex + 1);
        }
      });
    }

    // Support basic swipe
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const slides = carousel.querySelectorAll('.pack-item');
      const slide = slides[currentIndex];
      const swidth = slide ? slide.offsetWidth : carousel.clientWidth;

      if (touchStartX - touchEndX > Math.min(50, swidth / 4) && currentIndex < dots.length - 1) {
        updateCarousel(currentIndex + 1);
      }
      if (touchEndX - touchStartX > Math.min(50, swidth / 4) && currentIndex > 0) {
        updateCarousel(currentIndex - 1);
      }
    }

    // Recalcule la largeur d'une diapositive au redimensionnement
    window.addEventListener('resize', () => {
      // Au redimensionnement, repositionne simplement la vue sur l'index courant
      // (la méthode updateCarousel recalcule target.offsetLeft à la volée).
      updateCarousel(currentIndex);
    });

    // position initiale
    updateCarousel(0);
  }
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      const faqAnswer = faqItem.querySelector('.faq-answer');
      
      // Fermer tous les autres items avec animation
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
        }
      });
      
      // Toggle l'item actuel
      if (!isActive) {
        faqItem.classList.add('active');
        // Calculer la hauteur réelle pour une animation fluide
        if (faqAnswer) {
          const contentHeight = faqAnswer.scrollHeight;
          faqAnswer.style.maxHeight = contentHeight + 'px';
        }
      } else {
        faqItem.classList.remove('active');
        if (faqAnswer) {
          faqAnswer.style.maxHeight = '0px';
        }
      }
    });
  });
  
  // Ajuster la hauteur lors du redimensionnement
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });
});
