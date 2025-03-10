// Why Us Section - Revolving Circles Logic
document.addEventListener('DOMContentLoaded', function() {
    initRevolvingCircles();
});

function initRevolvingCircles() {
    const circleOrbit = document.querySelector('.circle-orbit');
    const revolvingCircles = document.querySelectorAll('.revolving-circle');
    
    if (!circleOrbit || !revolvingCircles.length) return;
    
    // Calculate responsive orbit size based on screen width
    function updateOrbitSize() {
        let orbitSize, translateDistance;
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 576) {
            // Mobile phones - Make circles larger but text smaller
            orbitSize = 220;
            translateDistance = 120;
        } else if (screenWidth <= 768) {
            // Tablets
            orbitSize = 280;
            translateDistance = 140;
        } else if (screenWidth <= 992) {
            // Small laptops
            orbitSize = 360;
            translateDistance = 170;
        } else {
            // Larger screens
            orbitSize = 480;
            translateDistance = 220;
        }
        
        // Update the orbit size
        circleOrbit.style.width = `${orbitSize}px`;
        circleOrbit.style.height = `${orbitSize}px`;
        
        // Position all circles correctly along the orbital path
        revolvingCircles.forEach((circle, index) => {
            const angle = index * (360 / revolvingCircles.length);
            const radian = angle * (Math.PI / 180);
            
            // Calculate x and y position on the circle
            const x = Math.cos(radian) * translateDistance;
            const y = Math.sin(radian) * translateDistance;
            
            // Apply transforms to position the circle and keep text upright
            circle.style.transform = `translate(${x}px, ${y}px)`;
            circle.style.left = '50%';
            circle.style.top = '50%';
            
            // Set size for different screen sizes
            let circleSize;
            if (screenWidth <= 576) {
                // Mobile phones - INCREASED circle size, DECREASED text size
                circleSize = 55;
                circle.style.fontSize = '0.55rem';
                circle.style.padding = '3px';
                // Make the text more compact
                const textSpan = circle.querySelector('span');
                if (textSpan) {
                    textSpan.style.lineHeight = '1';
                    textSpan.style.display = 'block';
                    textSpan.style.maxWidth = '80%';
                    textSpan.style.margin = '0 auto';
                    textSpan.style.wordBreak = 'break-word';
                    textSpan.style.fontSize = '0.5rem';
                }
            } else if (screenWidth <= 768) {
                circleSize = 60;
                circle.style.fontSize = '0.8rem';
                circle.style.padding = '6px';
            } else if (screenWidth <= 992) {
                circleSize = 80;
                circle.style.fontSize = '0.9rem';
                circle.style.padding = '8px';
            } else {
                circleSize = 100;
                circle.style.fontSize = '1rem';
                circle.style.padding = '10px';
            }
            
            circle.style.width = `${circleSize}px`;
            circle.style.height = `${circleSize}px`;
            circle.style.marginLeft = `-${circleSize/2}px`;
            circle.style.marginTop = `-${circleSize/2}px`;
        });
    }
    
    // Initial setup
    updateOrbitSize();
    
    // Add animation to orbit for a subtle rotating effect
    let animationFrame;
    let rotation = 0;
    
    function animateOrbit() {
        rotation += 0.3;
        circleOrbit.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        // Keep text upright despite orbit rotation
        revolvingCircles.forEach((circle) => {
            circle.firstElementChild.style.transform = `rotate(${-rotation}deg)`;
        });
        
        animationFrame = requestAnimationFrame(animateOrbit);
    }
    
    // Start animation
    animateOrbit();
    
    // Update positions on window resize
    window.addEventListener('resize', updateOrbitSize);
    
    // Clean up animation when page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else {
            animateOrbit();
        }
    });
}
