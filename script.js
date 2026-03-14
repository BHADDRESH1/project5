// script.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 2b. Smooth scroll for Hero CTA Button
    const heroBtn = document.querySelector('.hero-cta a');
    if (heroBtn) {
        heroBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - document.getElementById('navbar').offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    }


    // 3. Ripple Effect for Buttons
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-effect');
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');
    const revealOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4b. Reveal-Left / Reveal-Right (Global Trading Partner section)
    const sideRevealEls = document.querySelectorAll('.reveal-left, .reveal-right');
    const sideRevealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    sideRevealEls.forEach(el => sideRevealObserver.observe(el));

    // 5. Staggered icon reveal in Global Sourcing section
    const staggeredItems = document.querySelectorAll('.staggered-in');
    const staggerObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const items = entry.target.querySelectorAll('.staggered-in');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 150);
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    const sourcing = document.querySelector('.sourcing-icons');
    if (sourcing) {
        staggerObserver.observe(sourcing);
    }

    // 6. Active Section Highlighting
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 7. Parallax effect on hero
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;
        if (scrollPosition < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrollPosition / 700);
        }
    });

    // 8. Hero Image Slider
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 9. Category Panel System
    const catTabs = document.querySelectorAll('.cat-tab');
    const catPanels = document.querySelectorAll('.category-panel');

    function showPanel(catId) {
        // Hide all panels
        catPanels.forEach(panel => {
            panel.classList.remove('active', 'revealed');
        });

        // Show selected panel
        const target = document.getElementById('cat-' + catId);
        if (!target) return;
        target.classList.add('active');

        // Trigger CSS transition with a tiny delay so display:grid takes effect first
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                target.classList.add('revealed');
            });
        });

        // Animate product list items sliding in
        const items = target.querySelectorAll('.cat-item');
        items.forEach((item, idx) => {
            item.classList.remove('slide-visible');
            setTimeout(() => {
                item.classList.add('slide-visible');
            }, 80 + idx * 80);
        });
    }

    // Init first panel
    showPanel('electronics');

    catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showPanel(tab.getAttribute('data-cat'));
        });
    });

    // 10. Product image swap on cat-item click
    catPanels.forEach(panel => {
        const items = panel.querySelectorAll('.cat-item');
        const img = panel.querySelector('.cat-visual-img');
        const label = panel.querySelector('.cat-visual-label');

        items.forEach(item => {
            item.addEventListener('click', () => {
                // Highlight selected item
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const newSrc = item.getAttribute('data-img');
                const newLabel = item.getAttribute('data-label');

                // Fade image out -> swap source -> fade back in
                if (img) {
                    img.classList.add('fade-out');
                    setTimeout(() => {
                        img.src = newSrc;
                        img.alt = newLabel;
                        img.onload = () => img.classList.remove('fade-out');
                        // Fallback in case already cached
                        if (img.complete) img.classList.remove('fade-out');
                    }, 400);
                }

                if (label) {
                    label.style.opacity = '0';
                    setTimeout(() => {
                        label.textContent = newLabel;
                        label.style.opacity = '1';
                    }, 400);
                }
            });
        });
    });

});
