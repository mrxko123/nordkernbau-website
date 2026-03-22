// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
if (navbar && !navbar.classList.contains('scrolled')) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in to elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.service-card, .why-card, .gallery-item, .benefit, .stat, .about-text, .about-image, .contact-info-card, .contact-form, .wwu-text, .wwu-images'
    );
    animateElements.forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${i % 5 * 0.1}s`;
        observer.observe(el);
    });
});

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
    counterObserver.observe(statsBar);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 56;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Check if returning from successful submission
    if (window.location.search.includes('sent=1')) {
        const btn = contactForm.querySelector('.btn');
        if (btn) {
            btn.textContent = 'Erfolgreich gesendet!';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.textContent = 'Nachricht senden';
                btn.style.background = '';
            }, 5000);
        }
    }

    contactForm.addEventListener('submit', (e) => {
        const btn = contactForm.querySelector('.btn');
        btn.textContent = 'Wird gesendet...';
        btn.disabled = true;
        // Form submits naturally via FormSubmit.co
    });
}

// ===== Gallery Scroll Animation =====
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    // On mobile, make all gallery items visible immediately (horizontal scroll)
    document.querySelectorAll('.gallery-item').forEach(card => {
        card.classList.add('visible');
    });
} else {
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 100);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '100px 0px' });

    document.querySelectorAll('.gallery-item').forEach(card => {
        galleryObserver.observe(card);
    });
}

// ===== Gallery Toggle =====
const galleryGrid = document.getElementById('galleryGrid');
const galleryToggle = document.getElementById('galleryToggle');

if (galleryGrid && galleryToggle) {
    const cardCount = galleryGrid.querySelectorAll('.gallery-item').length;
    if (cardCount > 9) {
        // collapsed by default on desktop
    } else {
        galleryToggle.classList.add('hidden');
    }

    galleryToggle.addEventListener('click', () => {
        if (!galleryGrid.classList.contains('expanded')) {
            galleryGrid.classList.add('expanded');
            galleryToggle.textContent = 'Weniger anzeigen';
            // Make all hidden gallery items visible immediately
            galleryGrid.querySelectorAll('.gallery-item').forEach((item, i) => {
                if (!item.classList.contains('visible')) {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, i * 60);
                }
            });
        } else {
            galleryGrid.classList.remove('expanded');
            galleryToggle.textContent = 'Mehr anzeigen';
            galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// ===== Lightbox Gallery =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const galleryCards = document.querySelectorAll('.gallery-item');

let currentIndex = 0;
let galleryImages = [];

function getVisibleGalleryImages() {
    const images = [];
    const grid = document.getElementById('galleryGrid');
    const isExpanded = grid && grid.classList.contains('expanded');

    galleryCards.forEach((card) => {
        const img = card.querySelector('img');
        if (!img) return;

        if (isExpanded) {
            images.push(img.src);
        } else {
            // Only include images that are actually visible (not hidden by overflow)
            const cardRect = card.getBoundingClientRect();
            const gridRect = grid ? grid.getBoundingClientRect() : null;
            if (gridRect && cardRect.top < gridRect.bottom) {
                images.push(img.src);
            } else if (!gridRect) {
                images.push(img.src);
            }
        }
    });
    return images;
}

galleryCards.forEach((card) => {
    const img = card.querySelector('img');
    if (img) {
        card.addEventListener('click', () => {
            galleryImages = getVisibleGalleryImages();
            const clickedSrc = img.src;
            currentIndex = galleryImages.indexOf(clickedSrc);
            if (currentIndex === -1) currentIndex = 0;
            openLightbox();
        });
    }
});

function openLightbox() {
    if (!lightbox) return;
    lightboxImg.className = '';
    lightboxImg.src = galleryImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.className = 'lightbox-slide-left';
    lightboxImg.src = galleryImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.className = 'lightbox-slide-right';
    lightboxImg.src = galleryImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// Touch swipe support for lightbox
if (lightbox) {
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    }, { passive: true });
}

// Hide scroll overlay on gallery scroll
const galleryScrollOverlay = document.getElementById('galleryScrollOverlay');
if (galleryGrid && galleryScrollOverlay) {
    galleryGrid.addEventListener('scroll', () => {
        if (galleryGrid.scrollLeft > 30) {
            galleryScrollOverlay.style.opacity = '0';
            galleryScrollOverlay.style.transition = 'opacity 0.4s ease';
        } else {
            galleryScrollOverlay.style.opacity = '1';
        }
    }, { passive: true });
}
