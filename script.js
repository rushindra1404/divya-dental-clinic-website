console.clear();

gsap.registerPlugin(ScrollTrigger);

// 1. Loader Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
        
        // Hero Entrance Sequence
        const tl = gsap.timeline({ delay: 0.2 });
        
        tl.to("#navbar", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0)
          .to(".hero-grid", { opacity: 1, duration: 0.1 }, 0)
          .from(".hero-brand-badge", { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, 0.1)
          .from(".hero-title", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, 0.2)
          .from(".hero-subtitle", { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, 0.6)
          .from(".hero-btns .btn", { opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 0.8)
          .from(".hero-glass-card", { opacity: 0, scale: 0.8, y: 30, duration: 1.2, ease: "back.out(1.2)" }, 0.8)
          .to(".scroll-indicator", { opacity: 1, duration: 1, ease: "power2.inOut" }, 1.5);
          
    }, 1500); // Wait for the progress bar to finish
});

// 2. Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// 3. Custom Cursor Glow
const cursorGlow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out"
    });
});

// 4. Canvas Video Scrollytelling Setup
const canvas = document.getElementById("hero-video");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

const frameCount = 240;
const currentFrame = index => `frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

const images = [];
const animationState = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

images[0].onload = render;

function render() {
    const img = images[animationState.frame];
    if(!img || !img.complete) return;
    
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let renderWidth, renderHeight, x, y;

    if (canvasRatio > imgRatio) {
        renderWidth = canvas.width;
        renderHeight = canvas.width / imgRatio;
        x = 0;
        y = (canvas.height - renderHeight) / 2;
    } else {
        renderWidth = canvas.height * imgRatio;
        renderHeight = canvas.height;
        x = (canvas.width - renderWidth) / 2;
        y = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, x, y, renderWidth, renderHeight);
}

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5 // Increased from 1 for smoother, slightly slower scrolling interpolation
    }
});

tl.to(animationState, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    onUpdate: render
}, 0);

tl.to("#lighting-overlay", {
    opacity: 0,
    ease: "power1.inOut",
}, 0);

// 5. Parallax Particles Generation
const particlesContainer = document.getElementById('particles-container');
const particleCount = window.innerWidth < 768 ? 10 : 30;
for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = `${Math.random() * 100}%`;
    p.style.width = `${Math.random() * 6 + 2}px`;
    p.style.height = p.style.width;
    p.style.animationDuration = `${Math.random() * 5 + 5}s`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    particlesContainer.appendChild(p);
}

// Particle Parallax on Scroll
gsap.to("#particles-container", {
    y: -300,
    ease: "none",
    scrollTrigger: {
        trigger: ".steps-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// 6. Navbar Scroll Behavior
let lastScrollY = window.scrollY;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.classList.add("hidden");
    } else {
        navbar.classList.remove("hidden");
    }
    lastScrollY = currentScrollY;
});

// 7. General Glass Tile Magnetic Hover
const tiles = document.querySelectorAll('.glass-tile:not(.flip-card-front):not(.flip-card-back)');
tiles.forEach(tile => {
    const glow = tile.querySelector('.tile-glow-follow');
    
    tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        }
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        tile.style.transform = `translateY(-5px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    tile.addEventListener('mouseleave', () => {
        tile.style.transform = '';
    });
});

// 8. Stats Count-up Animations
const statTiles = document.querySelectorAll('.experience-tile');
statTiles.forEach((tile) => {
    const counter = tile.querySelector('.counter');
    if (!counter) return;
    const target = parseInt(counter.getAttribute('data-target') || 0);
    
    gsap.from(tile, {
        opacity: 0,
        scale: 0.8,
        y: 40,
        duration: 1.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
            trigger: tile.parentElement,
            start: "top 80%",
            onEnter: () => {
                let current = { val: 0 };
                gsap.to(current, {
                    val: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                        counter.textContent = Math.ceil(current.val);
                    }
                });
            }
        }
    });
});

// 9. Staggered Scroll Reveals
gsap.from(".feature-card", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".features-grid",
        start: "top 85%"
    }
});

gsap.from(".flip-card", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%"
    }
});

// 10. General Section Reveals (Fixing invisible text)
const steps = gsap.utils.toArray('.step .content');
steps.forEach((step, i) => {
    // Skip hero content as it animates on load
    if (step.classList.contains('hero-content')) return;

    gsap.fromTo(step, 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
                trigger: step.parentElement,
                start: "top center",
                end: "center center",
                scrub: true
            }
        }
    );
    
    // Fade out as it leaves, except the last one
    if (i !== steps.length - 1) {
        gsap.to(step, {
            opacity: 0,
            y: -50,
            scrollTrigger: {
                trigger: step.parentElement,
                start: "bottom 60%", // Delay the fade out start
                end: "bottom top",   // Finish fade out when element leaves top
                scrub: true
            }
        });
    }
});

// 11. Smooth Scroll for Anchor Links (Navbar)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Use Lenis to smoothly scroll to the target section
            lenis.scrollTo(target, {
                offset: -50, // Slight offset so the navbar doesn't cover content
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// 12. Before & After Slider Logic
const sliderContainers = document.querySelectorAll('.comparison-slider');

sliderContainers.forEach(container => {
    const overlay = container.querySelector('.slider-overlay');
    const handle = container.querySelector('.slider-handle');
    const topImage = container.querySelector('.slider-top');
    let isDragging = false;

    // Update the top image width to match the container width so it doesn't squash
    const updateImageWidth = () => {
        topImage.style.width = `${container.clientWidth}px`;
    };
    
    // Initial call and resize listener
    updateImageWidth();
    window.addEventListener('resize', updateImageWidth);

    const updateSlider = (clientX) => {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left; // x position within the element
        
        // Boundaries
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        const percentage = (x / rect.width) * 100;
        
        overlay.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };

    // Mouse Events
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch Events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    }, { passive: true });
    
    window.addEventListener('touchend', () => {
        isDragging = false;
    });
});

// 13. Mobile Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            // Allow Lenis smooth scroll to handle navigation if applicable
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -50, duration: 1.5 });
            }
        });
    });
}

// 14. Touch interactions for flip cards
const flipCards = document.querySelectorAll('.flip-card');
flipCards.forEach(card => {
    card.addEventListener('click', () => {
        if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
            // Close other cards
            flipCards.forEach(otherCard => {
                if (otherCard !== card) otherCard.classList.remove('active');
            });
            card.classList.toggle('active');
        }
    });
});
