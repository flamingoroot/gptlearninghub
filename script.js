// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-links a');
    const faqItems = document.querySelectorAll('.faq-item');
    const reviewPagination = document.querySelectorAll('.reviews-pagination span');
    const reviewCards = document.querySelectorAll('.review-card');
    
    // Enhanced function to ensure hamburger menu is always visible on mobile
    function ensureHamburgerVisibility() {
        if (window.innerWidth <= 992) {
            console.log('Mobile view detected - ensuring hamburger visibility');
            hamburger.style.display = 'flex';
            hamburger.style.visibility = 'visible';
            hamburger.style.opacity = '1';
            
            // Make sure each of the spans inside the hamburger is visible too
            const hamburgerSpans = hamburger.querySelectorAll('span');
            hamburgerSpans.forEach(span => {
                span.style.display = 'block';
                span.style.visibility = 'visible';
                span.style.opacity = '1';
            });
            
            // Force repaint hamburger
            hamburger.offsetHeight;
        }
    }
    
    // Call immediately on page load
    ensureHamburgerVisibility();
    
    // Also call on resize to handle orientation changes
    window.addEventListener('resize', ensureHamburgerVisibility);
    
    // Initialize components
    initSplineViewer();
    initLaptopVideoPlayer();
    
    // Function to initialize and handle the laptop video player
    function initLaptopVideoPlayer() {
        const video = document.getElementById('laptop-video');
        const videoContainer = video.closest('.laptop-video');
        const centerPlayButton = videoContainer.querySelector('.center-play-button');
        let hasStarted = false;
        
        // Function to handle play/pause
        function togglePlayPause() {
            if (video.paused) {
                if (!hasStarted) {
                    // First time playing - hide button permanently
                    hasStarted = true;
                    videoContainer.classList.add('started');
                    centerPlayButton.style.display = 'none';
                }
                video.play().catch(error => {
                    console.error('Error playing video:', error);
                });
            } else {
                video.pause();
            }
        }

        // Video container click handler (entire video frame)
        videoContainer.addEventListener('click', function(e) {
            if (hasStarted) {
                // Only handle click for play/pause if video has started
                e.preventDefault();
                togglePlayPause();
            }
        });

        // Initial play button click handler
        centerPlayButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!hasStarted) {
                togglePlayPause();
            }
        });

        // Handle video ending
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            if (hasStarted) {
                // Auto-play when video ends if it has started before
                video.play().catch(error => {
                    console.error('Error replaying video:', error);
                });
            }
        });

        // Ensure proper initial state
        video.addEventListener('loadedmetadata', function() {
            if (!hasStarted) {
                centerPlayButton.style.display = 'flex';
            } else {
                centerPlayButton.style.display = 'none';
            }
        });
    }

    // Set up course section animations
    initCourseAnimations();

    // Enhanced header scroll effect with parallax and content protection
    function updateHeaderAndParallax() {
        // Update header sticky state
        header.classList.toggle('sticky', window.scrollY > 50);
        
        // Calculate header height and ensure content doesn't overlap
        const headerHeight = header.offsetHeight;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            // Set different safety margins based on screen width
            let safetyMargin = 30; // Default for desktop
            
            // Adjust safety margin for different screen sizes
            if (window.innerWidth <= 480) {
                safetyMargin = 70; // Extra space for mobile
            } else if (window.innerWidth <= 768) {
                safetyMargin = 50; // More space for tablets
            } else if (window.innerWidth <= 992) {
                safetyMargin = 40; // Medium space for small desktops
            }
            
            // Ensure minimum padding is header height + safety margin
            const minPadding = headerHeight + safetyMargin;
            const currentPadding = parseInt(window.getComputedStyle(hero).paddingTop);
            
            if (currentPadding < minPadding) {
                hero.style.paddingTop = `${minPadding}px`;
                console.log('Adjusted hero padding to: ' + minPadding + 'px');
            }
        }
        
        // Add subtle parallax effect to logo when scrolling
        const logo = document.querySelector('.logo h1');
        if (logo) {
            const scrollPosition = window.scrollY;
            const scale = Math.max(0.9, 1 - (scrollPosition * 0.0005));
            const translateY = scrollPosition * 0.03;
            logo.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
    }

    // Add scroll listener with throttling
    let scrollTimeout = null;
    const handleScroll = () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateHeaderAndParallax();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Initial call
    updateHeaderAndParallax();

    // Mobile menu toggle with improved animation
    const toggleMobileMenu = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('Mobile menu toggle called');
        
        // Force re-rendering of the nav element
        const nav = document.querySelector('nav');
        const display = window.getComputedStyle(nav).getPropertyValue('display');
        nav.style.display = 'none';
        setTimeout(() => {
            nav.style.display = display;
            
            // Toggle the mobile menu classes
            header.classList.toggle('mobile-nav-active');
            document.body.classList.toggle('no-scroll');
            
            console.log('Menu state:', header.classList.contains('mobile-nav-active'));
        }, 10);
    };
    
    // Attach multiple event types to ensure it works on all devices
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        console.log('Hamburger touchstart triggered');
        toggleMobileMenu(e);
    }, { passive: false });
    
    // Add additional touchend handler for iOS devices
    hamburger.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        e.stopPropagation();
        console.log('Hamburger touchend triggered');
    }, { passive: false });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (header.classList.contains('mobile-nav-active')) {
                header.classList.remove('mobile-nav-active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (header.classList.contains('mobile-nav-active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            header.classList.remove('mobile-nav-active');
            document.body.classList.remove('no-scroll');
        }
    });

    // FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the current FAQ item
            item.classList.toggle('active');
        });
    });

    // Reviews pagination
    reviewPagination.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Remove active class from all pagination dots
            reviewPagination.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked dot
            this.classList.add('active');
            
            // Calculate slide position
            const slidePosition = index * -100;
            
            // Update reviews slider
            document.querySelector('.reviews-slider').style.transform = `translateX(${slidePosition}%)`;
        });
    });

    // Add reveal animations on scroll
    const revealElements = document.querySelectorAll('.category-card, .course-card, .review-card, .partner, .faq-item');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.8;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);

    // Course hover effect for better UX
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.course-image img').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.course-image img').style.transform = 'scale(1)';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Special handling for demo-section with additional offset
                const offset = targetId === '#demo-section' ? 120 : 80;
                
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Normally you would send this to a server
                // This is just a simulation
                emailInput.value = '';
                
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.textContent = 'Thank you for subscribing!';
                successMessage.style.color = '#a5b4fc';
                successMessage.style.marginTop = '10px';
                
                // Remove any existing message
                const existingMessage = this.querySelector('p');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                this.appendChild(successMessage);
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }

    // Animated counter for stats
    const stats = document.querySelectorAll('.stat h3');
    
    function animateCounter(el) {
        const target = parseInt(el.textContent.replace(/[^\d]/g, ''));
        const suffix = el.textContent.replace(/[\d]/g, '');
        let count = 0;
        const duration = 2000; // ms
        const step = target / (duration / 16); // 60fps approx
        
        const updateCount = () => {
            count += step;
            if (count < target) {
                el.textContent = Math.floor(count) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target + suffix;
            }
        };
        
        updateCount();
    }
    
    // Initialize stats animation when in view
    const statsSection = document.querySelector('.hero-stats');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stats.forEach(animateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // Dynamic header effect on scroll
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Initialize the Why Us section
    initWhyUsSection();
    
    // Initialize the Review Items
    // initReviewItems(); // Remove or comment out the old review function
    
    // Initialize the new Reviews Slider
    initReviewsSlider();
    
    // Initialize the Partner Items
    initPartnerItems();
    
    // Initialize the Solar System for Why Us section
    initSolarSystem();
    
    // Initialize the interactive globe
    initInteractiveGlobe();
    
    // Initialize the bonus resources section
    initBonusResources();
});

// Initialize Why Us Section Animation
function initWhyUsSection() {
    const whyUsCircle = document.querySelector('.why-us-circle');
    const whyUsItems = document.querySelectorAll('.why-us-item');
    
    if (!whyUsCircle) return;
    
    // Add rotation animation to the main circle
    whyUsCircle.style.transition = 'transform 1s ease';
    
    // Gentle floating animation for the circle
    let startTime = Date.now();
    function animateCircle() {
        const elapsed = Date.now() - startTime;
        const yMovement = Math.sin(elapsed / 1000) * 5;
        const rotation = Math.sin(elapsed / 3000) * 5;
        
        whyUsCircle.style.transform = `translateY(${yMovement}px) rotate(${rotation}deg)`;
        requestAnimationFrame(animateCircle);
    }
    
    animateCircle();
    
    // Set up intersection observer for the Why Us items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Initial state and observe
    whyUsItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// Initialize Review Items Animation
function initReviewItems() {
    const reviewItems = document.querySelectorAll('.review-item');
    
    if (!reviewItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Initial state and observe
    reviewItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize Partner Items Animation
function initPartnerItems() {
    const partnerItems = document.querySelectorAll('.partner-item');
    
    if (!partnerItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Initial state and observe
    partnerItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// Initialize Reviews Slider
function initReviewsSlider() {
    const slider = document.querySelector('.reviews-slider');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!slider || !dots.length) return;
    
    let currentSlide = 0;
    const totalSlides = dots.length;
    let startX, endX;
    let autoSlideInterval;
    
    // Function to go to a specific slide
    function goToSlide(index) {
        currentSlide = index;
        slider.style.transform = `translateX(-${index * 50}%)`; // Each slide is 50% wide
        
        // Update active indicator
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Initialize auto sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 6000); // Longer interval for multiple reviews
    }
    
    // Set up touch events for mobile swipe
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        clearInterval(autoSlideInterval);
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (!startX) return;
        endX = e.touches[0].clientX;
        const diffX = startX - endX;
        
        // Add resistance at the edges
        if ((currentSlide === 0 && diffX < 0) || 
            (currentSlide === totalSlides - 1 && diffX > 0)) {
            slider.style.transform = `translateX(${-currentSlide * 50 - diffX / 8}%)`;
        } else {
            slider.style.transform = `translateX(${-currentSlide * 50 - diffX / 2}%)`;
        }
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
        if (!startX || !endX) return;
        
        const diffX = startX - endX;
        const threshold = 100; // Higher threshold for multi-review slider
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentSlide < totalSlides - 1) {
                // Swipe left, go to next slide
                currentSlide++;
            } else if (diffX < 0 && currentSlide > 0) {
                // Swipe right, go to previous slide
                currentSlide--;
            }
        }
        
        goToSlide(currentSlide);
        startX = null;
        endX = null;
        
        startAutoSlide();
    }, { passive: true });
    
    // Mouse drag functionality
    let isDragging = false;
    let dragStartX = 0;
    let lastTranslate = 0;
    
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        lastTranslate = -currentSlide * 50;
        slider.style.transition = 'none';
        slider.style.cursor = 'grabbing';
        clearInterval(autoSlideInterval);
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dragDistance = e.clientX - dragStartX;
        const percentMove = (dragDistance / slider.offsetWidth) * 100;
        
        // Add resistance at the edges
        if ((currentSlide === 0 && percentMove > 0) || 
            (currentSlide === totalSlides - 1 && percentMove < 0)) {
            slider.style.transform = `translateX(${lastTranslate + percentMove / 4}%)`;
        } else {
            slider.style.transform = `translateX(${lastTranslate + percentMove}%)`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        slider.style.cursor = '';
        slider.style.transition = 'transform 0.5s ease-in-out';
        
        const currentTransform = parseFloat(slider.style.transform.replace('translateX(', '').replace('%)', ''));
        const movePercent = currentTransform - lastTranslate;
        
        if (movePercent > 10 && currentSlide > 0) {
            // Dragged right enough to go to previous slide
            currentSlide--;
        } else if (movePercent < -10 && currentSlide < totalSlides - 1) {
            // Dragged left enough to go to next slide
            currentSlide++;
        }
        
        goToSlide(currentSlide);
        startAutoSlide();
    });
    
    slider.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = '';
            slider.style.transition = 'transform 0.5s ease-in-out';
            goToSlide(currentSlide);
            startAutoSlide();
        }
    });
    
    // Click events for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            clearInterval(autoSlideInterval);
            startAutoSlide();
        });
    });
    
    // Initialize slider
    goToSlide(0);
    startAutoSlide();
    
    // Add animation to review boxes when they enter viewport
    const reviewBoxes = document.querySelectorAll('.review-box');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Set initial state and observe
    reviewBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(box);
    });
}

// Initialize Solar System for Why Us
function initSolarSystem() {
    const solarSystem = document.querySelector('.solar-system');
    const globe = document.querySelector('.globe');
    const globeContainer = document.querySelector('.globe-container');
    
    if (!solarSystem || !globe) return;
    
    // Add the orbital circles dynamically
    if (!document.querySelector('.orbital-circle-1')) {
        const orbitalCircle1 = document.createElement('div');
        orbitalCircle1.className = 'orbital-circle-1';
        globeContainer.appendChild(orbitalCircle1);
        
        const orbitalCircle2 = document.createElement('div');
        orbitalCircle2.className = 'orbital-circle-2';
        globeContainer.appendChild(orbitalCircle2);
    }
    
    // 3D interactive rotation variables
    let isDragging = false;
    let rotationX = 20;
    let rotationY = 0;
    let lastMouseX, lastMouseY;
    
    // Stop automatic rotation on mouse enter
    globe.addEventListener('mouseenter', () => {
        globe.style.animation = 'none';
        
        // Set initial rotation to prevent jump
        globe.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
    });
    
    // Resume animation on mouse leave if not dragging
    globe.addEventListener('mouseleave', () => {
        if (!isDragging) {
            globe.style.animation = 'rotateGlobe 30s linear infinite';
        }
    });
    
    // 3D rotation with mouse movement
    globe.addEventListener('mousedown', (e) => {
        isDragging = true;
        globe.style.animation = 'none';
        globe.style.cursor = 'grabbing';
        
        // Store initial mouse position
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        // Prevent default behavior
        e.preventDefault();
    });
    
    // Track mouse movement for rotation
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculate mouse movement delta
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        // Update rotation values (reversed for intuitive control)
        rotationY += deltaX * 0.5;
        rotationX -= deltaY * 0.5;
        
        // Limit X rotation to prevent flipping
        rotationX = Math.max(-60, Math.min(60, rotationX));
        
        // Apply transformation
        globe.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        
        // Update last position
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    
    // Handle mouseup and mouseleave events
    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            globe.style.cursor = 'grab';
        }
    };
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);
    
    // Handle touch events for mobile devices
    globe.addEventListener('touchstart', (e) => {
        isDragging = true;
        globe.style.animation = 'none';
        
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.touches[0].clientX - lastMouseX;
        const deltaY = e.touches[0].clientY - lastMouseY;
        
        rotationY += deltaX * 0.5;
        rotationX -= deltaY * 0.5;
        rotationX = Math.max(-60, Math.min(60, rotationX));
        
        globe.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', endDrag);
}

// Main JavaScript for the website

// Initialize the video player
function initVideoPlayer() {
    const videoContainer = document.querySelector('.video-container');
    const video = document.querySelector('.video-player');
    const playButton = document.querySelector('.play-button');
    const volumeButton = document.querySelector('.volume-button');
    const fullscreenButton = document.querySelector('.fullscreen-button');
    const pipButton = document.querySelector('.pip-button');
    const progressBar = document.querySelector('.progress-bar');
    const progressIndicator = document.querySelector('.progress-indicator');
    const currentTimeDisplay = document.querySelector('.current-time');
    const durationDisplay = document.querySelector('.duration');
    const controlsWrapper = document.querySelector('.controls-wrapper');
    
    if (!video || !videoContainer) return;
    
    // Toggle play/pause
    function togglePlay() {
        if (video.paused) {
            video.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            videoContainer.classList.add('playing');
        } else {
            video.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            videoContainer.classList.remove('playing');
        }
    }
    
    // Toggle volume
    function toggleVolume() {
        video.muted = !video.muted;
        updateVolumeIcon();
    }
    
    // Update volume icon based on mute state
    function updateVolumeIcon() {
        volumeButton.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    }
    
    // Toggle fullscreen
    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoContainer.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    }
    
    // Toggle Picture-in-Picture
    async function togglePiP() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.error(`Error with Picture-in-Picture: ${error}`);
        }
    }
    
    // Update progress bar
    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressIndicator.style.width = `${percent}%`;
        
        // Update time displays
        currentTimeDisplay.textContent = formatTime(video.currentTime);
        durationDisplay.textContent = formatTime(video.duration);
    }
    
    // Format time to MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Seek in the video
    function seek(e) {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    }
    
    // Show/hide controls
    function toggleControls() {
        if (video.paused) return;
        controlsWrapper.classList.toggle('visible');
    }
    
    // Event listeners
    playButton.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    volumeButton.addEventListener('click', toggleVolume);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    pipButton.addEventListener('click', togglePiP);
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);
    
    progressBar.addEventListener('click', seek);
    
    videoContainer.addEventListener('mouseenter', () => {
        controlsWrapper.classList.add('visible');
    });
    
    videoContainer.addEventListener('mouseleave', () => {
        if (!video.paused) {
            controlsWrapper.classList.remove('visible');
        }
    });
    
    // Initial setup
    updateVolumeIcon();
}

// Make the globe interactive
function initInteractiveGlobe() {
    const globe = document.querySelector('.globe');
    if (!globe) return;

    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let rotation = {
        x: 20,
        y: 0
    };
    let animationPaused = false;

    // Stop the default animation when user interacts
    function pauseAnimation() {
        if (!animationPaused) {
            globe.style.animation = 'none';
            globe.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
            animationPaused = true;
        }
    }

    // Resume the default animation
    function resumeAnimation() {
        globe.style.animation = 'rotateGlobe 30s linear infinite';
        globe.style.transform = '';
        animationPaused = false;
    }

    // Mouse down event
    globe.addEventListener('mousedown', (e) => {
        isDragging = true;
        pauseAnimation();
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
        e.preventDefault();
    });

    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        rotation.y += deltaMove.x * 0.5;
        rotation.x = Math.max(-30, Math.min(90, rotation.x + deltaMove.y * 0.5));

        globe.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });

    // Mouse up event
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mouse leave event
    globe.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    // Double click to reset
    globe.addEventListener('dblclick', () => {
        resumeAnimation();
    });

    // Touch events for mobile
    globe.addEventListener('touchstart', (e) => {
        isDragging = true;
        pauseAnimation();
        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y
        };

        rotation.y += deltaMove.x * 0.5;
        rotation.x = Math.max(-30, Math.min(90, rotation.x + deltaMove.y * 0.5));

        globe.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;

        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Enhanced Spline Viewer in FAQ section
function initSplineViewer() {
    const splineContainer = document.querySelector('.spline-container');
    const splineGlowOverlay = document.querySelector('.spline-glow-overlay');
    const splineViewer = document.querySelector('spline-viewer');
    
    if (!splineContainer || !splineViewer) return;
    
    // Add a subtle hover effect to the spline container
    splineContainer.addEventListener('mouseenter', () => {
        splineContainer.style.transform = 'scale(1.02)';
        splineContainer.style.boxShadow = '0 0 40px rgba(229, 9, 20, 0.4)';
        if (splineGlowOverlay) {
            splineGlowOverlay.style.background = 'radial-gradient(circle at center, rgba(229, 9, 20, 0.25) 0%, rgba(0, 0, 0, 0) 70%)';
        }
    });
    
    splineContainer.addEventListener('mouseleave', () => {
        splineContainer.style.transform = '';
        splineContainer.style.boxShadow = '';
        if (splineGlowOverlay) {
            splineGlowOverlay.style.background = '';
        }
    });
    
    // When an FAQ item is opened, add a pulse effect to the Spline viewer
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                // Add a quick pulse animation
                splineContainer.classList.add('pulse');
                setTimeout(() => {
                    splineContainer.classList.remove('pulse');
                }, 500);
            }
        });
    });
    
    // Add responsive behavior for the Spline viewer
    window.addEventListener('resize', () => {
        adjustSplineContainerHeight();
    });
    
    // Initial height adjustment
    adjustSplineContainerHeight();
}

// Function to adjust Spline container height to match FAQ container
function adjustSplineContainerHeight() {
    const faqContainer = document.querySelector('.faq-container');
    const splineContainer = document.querySelector('.spline-container');
    
    if (faqContainer && splineContainer && window.innerWidth > 992) {
        const faqHeight = faqContainer.offsetHeight;
        splineContainer.style.minHeight = `${faqHeight}px`;
        const splineViewer = splineContainer.querySelector('spline-viewer');
        if (splineViewer) {
            splineViewer.style.minHeight = `${faqHeight}px`;
        }
    }
}

// Bonus Resources functionality is now in bonus-resources.js