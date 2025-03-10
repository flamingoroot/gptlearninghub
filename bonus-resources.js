/**
 * Bonus Resources Carousel Functionality
 * This file contains all the JavaScript code for the Bonus Resources section carousel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Bonus Resources carousel when the DOM is fully loaded
    initBonusResourcesCarousel();
});

/**
 * Initialize the Bonus Resources carousel functionality
 */
function initBonusResourcesCarousel() {
    // Select all the necessary elements
    const bonusSphere = document.querySelector('.bonus-sphere');
    const sphereContents = document.querySelectorAll('.sphere-content');
    const sphereDots = document.querySelectorAll('.sphere-dot');
    
    // Check if all required elements exist
    if (!bonusSphere || !sphereContents.length || !sphereDots.length) {
        console.error('Required elements for Bonus Resources carousel not found');
        return;
    }
    
    console.log('Bonus Resources carousel initialized with:', {
        'contents': sphereContents.length,
        'dots': sphereDots.length
    });
    
    // Animation settings
    let currentIndex = 0;
    let isAutoSwitching = true;
    const switchInterval = 5000; // 5 seconds
    let autoSwitchTimer;
    
    // Function to switch to a specific bonus
    function switchToBonus(index) {
        console.log('Switching to bonus:', index);
        
        // Reset all content items
        sphereContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
        });
        
        // Reset all navigation dots
        sphereDots.forEach(dot => dot.classList.remove('active'));
        
        // Show the selected content with animation after a brief delay
        setTimeout(() => {
            // Get the target content and dot
            const targetContent = sphereContents[index];
            const targetDot = sphereDots[index];
            
            if (targetContent && targetDot) {
                // Activate the content and dot
                targetContent.classList.add('active');
                targetDot.classList.add('active');
                
                // Apply animation
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
                
                // Apply a shake animation to the sphere
                bonusSphere.classList.add('shake');
                setTimeout(() => {
                    bonusSphere.classList.remove('shake');
                }, 600);
                
                // Update the current index
                currentIndex = index;
            }
        }, 300);
        
        // Reset the auto-switch timer if enabled
        if (isAutoSwitching) {
            clearTimeout(autoSwitchTimer);
            autoSwitchTimer = setTimeout(nextBonus, switchInterval);
        }
    }
    
    // Function to switch to the next bonus
    function nextBonus() {
        const nextIndex = (currentIndex + 1) % sphereContents.length;
        switchToBonus(nextIndex);
    }
    
    // Function to switch to the previous bonus
    function prevBonus() {
        const prevIndex = (currentIndex - 1 + sphereContents.length) % sphereContents.length;
        switchToBonus(prevIndex);
    }
    
    // Set up click handlers for navigation dots
    sphereDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Pause auto-switching temporarily when user interacts
            isAutoSwitching = false;
            clearTimeout(autoSwitchTimer);
            
            // Switch to the clicked bonus
            switchToBonus(index);
            
            // Resume auto-switching after a pause
            setTimeout(() => {
                isAutoSwitching = true;
                autoSwitchTimer = setTimeout(nextBonus, switchInterval);
            }, 10000); // 10 seconds of inactivity before resuming
        });
    });
    
    // Add touch swipe functionality for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    bonusSphere.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    bonusSphere.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next
            nextBonus();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous
            prevBonus();
        }
    }
    
    // Mouse hover behavior
    bonusSphere.addEventListener('mouseenter', () => {
        // Pause auto-switching when hovering
        isAutoSwitching = false;
        clearTimeout(autoSwitchTimer);
    });
    
    bonusSphere.addEventListener('mouseleave', () => {
        // Resume auto-switching when no longer hovering
        isAutoSwitching = true;
        autoSwitchTimer = setTimeout(nextBonus, switchInterval);
    });
    
    // Add left and right arrow keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only if the bonus resources section is in the viewport
        const bonusSection = document.getElementById('bonus-resources');
        if (bonusSection && isElementInViewport(bonusSection)) {
            if (e.key === 'ArrowRight') {
                nextBonus();
            } else if (e.key === 'ArrowLeft') {
                prevBonus();
            }
        }
    });
    
    // Helper function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0
        );
    }
    
    // Initialize carousel with first item active
    sphereContents[0].classList.add('active');
    sphereDots[0].classList.add('active');
    
    // Apply styles for transitions
    sphereContents.forEach(content => {
        content.style.transition = 'opacity 0.5s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    // Add keyframe animations and required CSS styles if not already in the CSS
    if (!document.getElementById('bonus-sphere-animations')) {
        const style = document.createElement('style');
        style.id = 'bonus-sphere-animations';
        style.textContent = `
            /* Bonus Resources Section Styles */
            .bonus-resources {
                padding: 80px 0;
                background-color: #0c0c0c;
                position: relative;
                overflow: hidden;
            }
            
            .sphere-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                max-width: 800px;
                margin: 0 auto;
                margin-top: 40px;
            }
            
            .bonus-sphere {
                width: 500px;
                height: 500px;
                margin: 0 auto;
                position: relative;
                background: radial-gradient(circle at center, rgba(40, 40, 40, 0.8) 0%, rgba(20, 20, 20, 0.9) 70%);
                border-radius: 50%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 25px rgba(229, 9, 20, 0.3);
                overflow: hidden;
                transition: transform 0.5s ease, box-shadow 0.5s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 2px solid rgba(229, 9, 20, 0.2);
            }
            
            .bonus-sphere:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(229, 9, 20, 0.4);
            }
            
            .sphere-inner {
                width: 100%;
                height: 100%;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .sphere-content {
                position: absolute;
                width: 90%;
                height: 90%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
                border-radius: 50%;
                text-align: center;
            }
            
            .sphere-content.active {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }
            
            .bonus-image {
                width: 160px;
                height: 160px;
                border-radius: 50%;
                overflow: hidden;
                margin-bottom: 30px;
                border: 4px solid rgba(229, 9, 20, 0.7);
                box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
                transition: transform 0.5s ease, box-shadow 0.5s ease;
            }
            
            .sphere-content.active .bonus-image {
                animation: pulse 2s infinite ease-in-out;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3); }
                50% { transform: scale(1.05); box-shadow: 0 8px 20px rgba(229, 9, 20, 0.5); }
                100% { transform: scale(1); box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3); }
            }
            
            .bonus-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }
            
            .sphere-content:hover .bonus-image img {
                transform: scale(1.1);
            }
            
            .bonus-info {
                text-align: center;
            }
            
            .bonus-info h3 {
                font-size: 1.8rem;
                margin-bottom: 15px;
                color: white;
                position: relative;
                display: inline-block;
            }
            
            .bonus-info h3::after {
                content: '';
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 50px;
                height: 3px;
                background-color: #E50914;
            }
            
            .bonus-info p {
                font-size: 1.1rem;
                color: #CCCCCC;
                line-height: 1.6;
                max-width: 300px;
                margin: 0 auto;
            }
            
            .sphere-nav {
                margin-top: 30px;
                display: flex;
                justify-content: center;
            }
            
            .sphere-dots {
                display: flex;
                gap: 10px;
            }
            
            .sphere-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .sphere-dot:hover {
                background-color: rgba(255, 255, 255, 0.5);
                transform: scale(1.2);
            }
            
            .sphere-dot.active {
                background-color: #E50914;
                transform: scale(1.2);
            }
            
            @keyframes bonusSphereShake {
                0% { transform: translateX(0); }
                20% { transform: translateX(3px) rotate(1deg); }
                40% { transform: translateX(-3px) rotate(-1deg); }
                60% { transform: translateX(2px) rotate(0.5deg); }
                80% { transform: translateX(-2px) rotate(-0.5deg); }
                100% { transform: translateX(0); }
            }
            
            .bonus-sphere.shake {
                animation: bonusSphereShake 0.6s ease;
            }
            
            /* Responsive styles */
            @media (max-width: 768px) {
                .bonus-sphere {
                    width: 420px;
                    height: 420px;
                }
                
                .bonus-image {
                    width: 130px;
                    height: 130px;
                }
                
                .bonus-info h3 {
                    font-size: 1.6rem;
                }
                
                .bonus-info p {
                    font-size: 1rem;
                    max-width: 260px;
                }
            }
            
            @media (max-width: 480px) {
                .bonus-sphere {
                    width: 320px;
                    height: 320px;
                }
                
                .sphere-nav {
                    margin-top: 20px;
                }
                
                .sphere-dot {
                    width: 10px;
                    height: 10px;
                }
                
                .bonus-image {
                    width: 100px;
                    height: 100px;
                    margin-bottom: 20px;
                }
                
                .bonus-info h3 {
                    font-size: 1.4rem;
                }
                
                .bonus-info p {
                    font-size: 0.9rem;
                    max-width: 220px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Start auto-switching
    console.log('Starting auto-switching carousel');
    autoSwitchTimer = setTimeout(nextBonus, switchInterval);
}
