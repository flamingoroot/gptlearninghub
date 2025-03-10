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

// Initialize the Why Us section with planets
function initWhyUsSection() {
    const planets = document.querySelectorAll('.planet');
    const globe = document.querySelector('.globe');
    
    if (!planets.length || !globe) return;
    
    // Add event listeners to the globe
    globe.addEventListener('mouseenter', () => {
        // Highlight all planets when hovering over the globe
        planets.forEach(planet => {
            planet.style.transform = 'scale(1.1)';
            planet.style.boxShadow = '0 0 20px rgba(229, 9, 20, 0.6)';
        });
    });
    
    globe.addEventListener('mouseleave', () => {
        // Reset planet styles
        planets.forEach(planet => {
            planet.style.transform = '';
            planet.style.boxShadow = '';
        });
    });
    
    // Add event listeners to each planet
    planets.forEach(planet => {
        planet.addEventListener('mouseenter', () => {
            // Highlight the globe when hovering over a planet
            globe.style.boxShadow = '0 0 50px rgba(229, 9, 20, 0.8)';
            
            // Scale up the current planet
            planet.style.transform = 'scale(1.2)';
            planet.style.boxShadow = '0 0 25px rgba(229, 9, 20, 0.8)';
        });
        
        planet.addEventListener('mouseleave', () => {
            // Reset globe and planet styles
            globe.style.boxShadow = '';
            planet.style.transform = '';
            planet.style.boxShadow = '';
        });
    });
}

// Completely rebuilt Bonus Resources hemisphere functionality
function initBonusResources() {
    const hemisphere = document.querySelector('.bonus-hemisphere');
    const circlesContainer = document.querySelector('.bonus-circles-container');
    const descriptionElement = document.querySelector('.bonus-description');
    
    if (!hemisphere || !circlesContainer || !descriptionElement) {
        console.error('Required elements for bonus resources not found');
        return;
    }

    // Clean up any existing stateful animations
    if (window.bonusAnimationFrame) {
        cancelAnimationFrame(window.bonusAnimationFrame);
        window.bonusAnimationFrame = null;
    }

    // Define the bonus resources data
    const bonusData = [
        {
            title: "Cheat Sheets",
            description: "Downloadable quick reference guides for all major topics covered in the course."
        },
        {
            title: "Practice Exercises",
            description: "Additional hands-on exercises to reinforce your learning and build practical skills."
        },
        {
            title: "Community Access",
            description: "Exclusive access to our private community where you can connect with peers and instructors."
        },
        {
            title: "Resource Library",
            description: "A comprehensive collection of articles, tutorials, and reference materials."
        },
        {
            title: "Certificate",
            description: "Receive a professional certificate upon successful completion of the course."
        }
    ];

    // Remove any existing circles first
    const existingCircles = circlesContainer.querySelectorAll('.bonus-circle');
    existingCircles.forEach(circle => circle.remove());

    // Create the circles
    const numberOfCircles = bonusData.length;
    const circles = [];
    
    for (let i = 0; i < numberOfCircles; i++) {
        const circle = document.createElement('div');
        circle.className = 'bonus-circle';
        circle.innerHTML = `<span>${bonusData[i].title}</span>`;
        circle.dataset.index = i;
        circlesContainer.appendChild(circle);
        circles.push(circle);
    }

    // Set initial description
    descriptionElement.textContent = "Click on any bonus resource to learn more";

    // Position circles around the hemisphere
    function positionCircles(animate = false) {
        // Get hemisphere's dimensions from its bounding client rect
        const hemisphereRect = hemisphere.getBoundingClientRect();
        const containerRect = circlesContainer.getBoundingClientRect();
        
        // Adjust for any offsets between container and hemisphere
        const offsetX = hemisphereRect.left - containerRect.left;
        const offsetY = hemisphereRect.top - containerRect.top;
        
        // Log positions for debugging
        console.log('Hemisphere position:', hemisphereRect.width, hemisphereRect.height);
        console.log('Container offset:', offsetX, offsetY);
        
        // Get center point and radius
        const width = hemisphereRect.width;
        const height = hemisphereRect.height;
        const centerX = width / 2 + offsetX;
        const centerY = height + offsetY; // Bottom center of hemisphere
        
        // Calculate circle size based on hemisphere width
        const circleSize = Math.max(60, Math.min(80, width * 0.16));
        
        // Set circle dimensions
        circles.forEach(circle => {
            circle.style.width = `${circleSize}px`;
            circle.style.height = `${circleSize}px`;
        });
        
        // If we're animating, use the current time to calculate angle offsets
        const now = animate ? Date.now() / 10000 : 0;
        
        // Position each circle
        circles.forEach((circle, index) => {
            // Calculate angle (in radians)
            // angleRange is π (180 degrees) for the hemisphere
            const baseAngle = (Math.PI / (numberOfCircles - 1)) * index;
            
            // For animation, add a small offset based on time
            // Each circle moves at a slightly different speed
            const angleOffset = animate ? Math.sin(now * (1 + index * 0.1)) * 0.05 : 0;
            const angle = baseAngle + angleOffset;
            
            // Calculate radius (slightly smaller than hemisphere width/2)
            const radius = (width / 2) * 0.92;
            
            // Calculate x and y coordinates using parametric equations for a semicircle
            // x = center_x + radius * cos(angle)
            // y = center_y - radius * sin(angle)
            const x = centerX + radius * Math.cos(angle);
            const y = centerY - radius * Math.sin(angle);
            
            // Position the circle, accounting for its size
            circle.style.left = `${x - circleSize / 2}px`;
            circle.style.top = `${y - circleSize / 2}px`;
            
            // Make circle visible with a staggered delay if not animating
            if (!animate && circle.style.opacity === '0') {
                setTimeout(() => {
                    circle.style.opacity = '1';
                }, 300 + (index * 150));
            } else if (!animate) {
                circle.style.opacity = '1';
            }
        });
        
        // If animating, request next frame
        if (animate) {
            window.bonusAnimationFrame = requestAnimationFrame(() => positionCircles(true));
        }
    }

    // Add click event to each circle
    circles.forEach(circle => {
        circle.addEventListener('click', function() {
            // Remove active class from all circles
            circles.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked circle
            this.classList.add('active');
            
            // Get the data index
            const index = parseInt(this.dataset.index);
            
            // Update description with animation
            descriptionElement.style.opacity = '0';
            
            setTimeout(() => {
                descriptionElement.textContent = bonusData[index].description;
                descriptionElement.classList.add('fade-in');
                descriptionElement.style.opacity = '1';
                
                // Remove the animation class after it completes
                setTimeout(() => {
                    descriptionElement.classList.remove('fade-in');
                }, 500);
            }, 300);
        });
    });

    // Initial positioning with a slight delay to ensure DOM is ready
    setTimeout(() => {
        positionCircles();
        // Start animation after initial positioning
        setTimeout(() => {
            positionCircles(true);
        }, 1000);
    }, 500);
    
    // Reposition on window resize
    window.addEventListener('resize', () => {
        // Use a debounce to avoid excessive calculations during resize
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            // Cancel any ongoing animation
            if (window.bonusAnimationFrame) {
                cancelAnimationFrame(window.bonusAnimationFrame);
                window.bonusAnimationFrame = null;
            }
            
            // Reposition and restart animation
            positionCircles();
            setTimeout(() => {
                positionCircles(true);
            }, 100);
        }, 250);
    });
}

// Initialize FAQ accordions
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle active class on the clicked item
            item.classList.toggle('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// Initialize all sections when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the video player
    initVideoPlayer();
    
    // Initialize the interactive globe
    initInteractiveGlobe();
    
    // Initialize the Why Us section
    initWhyUsSection();
    
    // Initialize the bonus resources section
    initBonusResources();
    
    // Initialize the FAQ section
    initFAQ();
}); 