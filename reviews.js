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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initReviewsSlider();
}); 