document.addEventListener('DOMContentLoaded', function() {
    const nameInputSection = document.getElementById('name-input-section');
    const recipientNameInput = document.getElementById('recipient-name');
    const startButton = document.getElementById('start-button');
    const giftBox = document.getElementById('gift-box');
    const surprise = document.getElementById('surprise');
    const replayButton = document.getElementById('replay-button');
    const confettiContainer = document.querySelector('.confetti-container');
    const sparkles = document.querySelectorAll('.sparkle');
    const displayName = document.getElementById('display-name');
    const shareSection = document.getElementById('share-section');
    const shareLink = document.getElementById('share-link');
    const copyButton = document.getElementById('copy-button');
    const shareButtons = document.querySelectorAll('.social-share');
    const balloons = document.querySelectorAll('.balloon');
    
    // Add audio elements
    const popSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
    const celebrationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    const buttonSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
    const successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3');
    
    // Initialize balloons with random positions and animations
    function initBalloons() {
        const positions = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];
        const durations = [8, 9, 10, 11, 12, 13];
        const delays = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        
        // Shuffle arrays
        shuffleArray(positions);
        shuffleArray(delays);
        
        balloons.forEach((balloon, index) => {
            // Random position
            balloon.style.left = positions[index % positions.length] + '%';
            
            // Random animation duration
            const duration = durations[Math.floor(Math.random() * durations.length)];
            balloon.style.setProperty('--float-duration', duration + 's');
            
            // Random animation delay
            const delay = delays[index % delays.length];
            balloon.style.animationDelay = delay + 's';
            
            // Random X movement for each keyframe
            balloon.style.setProperty('--float-x-1', (Math.random() * 40 - 20) + 'px');
            balloon.style.setProperty('--float-x-2', (Math.random() * 60 - 30) + 'px');
            balloon.style.setProperty('--float-x-3', (Math.random() * 40 - 20) + 'px');
            balloon.style.setProperty('--float-x-4', (Math.random() * 60 - 30) + 'px');
            balloon.style.setProperty('--float-x-5', (Math.random() * 40 - 20) + 'px');
            balloon.style.setProperty('--float-x-6', (Math.random() * 20 - 10) + 'px');
            
            // Random rotation for each keyframe
            balloon.style.setProperty('--rotate-1', (Math.random() * 10 - 5) + 'deg');
            balloon.style.setProperty('--rotate-2', (Math.random() * 20 - 10) + 'deg');
            balloon.style.setProperty('--rotate-3', (Math.random() * 10 - 5) + 'deg');
            balloon.style.setProperty('--rotate-4', (Math.random() * 20 - 10) + 'deg');
            balloon.style.setProperty('--rotate-5', (Math.random() * 10 - 5) + 'deg');
            balloon.style.setProperty('--rotate-6', (Math.random() * 6 - 3) + 'deg');
            
            // Random scale for each keyframe
            balloon.style.setProperty('--scale-1', (0.95 + Math.random() * 0.1).toFixed(2));
            balloon.style.setProperty('--scale-2', (1.0 + Math.random() * 0.1).toFixed(2));
            balloon.style.setProperty('--scale-3', (0.9 + Math.random() * 0.1).toFixed(2));
            balloon.style.setProperty('--scale-4', (1.05 + Math.random() * 0.1).toFixed(2));
            balloon.style.setProperty('--scale-5', (0.85 + Math.random() * 0.15).toFixed(2));
            balloon.style.setProperty('--scale-6', '1');
            
            // Initial scale for each balloon
            const scale = 0.8 + Math.random() * 0.4; // Scale between 0.8 and 1.2
            balloon.style.transform = `scale(${scale})`;
        });
    }
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Check URL parameters for name
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        
        if (nameParam) {
            // If name parameter exists, skip input and go straight to gift
            displayName.textContent = decodeURIComponent(nameParam);
            nameInputSection.classList.add('hidden');
            giftBox.classList.remove('hidden');
            giftBox.style.opacity = '1';
            animateSparkles();
        }
    }
    
    // Generate shareable link
    function generateShareableLink(name) {
        const url = new URL(window.location.href.split('?')[0]); // Remove any existing query params
        url.searchParams.append('name', name);
        return url.toString();
    }
    
    // Update share buttons
    function updateShareButtons(name) {
        const shareUrl = generateShareableLink(name);
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(`Celebrate with me! Happy Birthday ${name}! 🎂🎉`);
        
        // Update copy link button
        shareLink.value = shareUrl;
        
        // Update social share buttons
        shareButtons.forEach(button => {
            const platform = button.getAttribute('data-platform');
            
            switch(platform) {
                case 'whatsapp':
                    button.href = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
                    break;
                case 'facebook':
                    button.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                    break;
                case 'twitter':
                    button.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                    break;
                case 'email':
                    button.href = `mailto:?subject=Happy Birthday ${name}!&body=${encodedText}%20${encodedUrl}`;
                    break;
            }
        });
    }
    
    // Copy link to clipboard
    function copyShareLink() {
        shareLink.select();
        document.execCommand('copy');
        
        // Play success sound
        successSound.play();
        
        // Show copied message
        const originalText = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
            copyButton.innerHTML = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
    }
    
    // Function to start the birthday surprise
    function startSurprise() {
        buttonSound.play();
        
        // Get the recipient's name from input
        let name = recipientNameInput.value.trim();
        
        // If no name is entered, use "Friend" as default
        if (name === '') {
            name = 'Friend';
        }
        
        // Set the name in the birthday message
        displayName.textContent = name;
        
        // Update share buttons with the name
        updateShareButtons(name);
        
        // Hide name input section with animation
        nameInputSection.style.opacity = '0';
        nameInputSection.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            nameInputSection.classList.add('hidden');
            giftBox.classList.remove('hidden');
            
            // Add a small delay before showing the gift box with animation
            setTimeout(() => {
                giftBox.style.opacity = '0';
                giftBox.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    giftBox.style.opacity = '1';
                    giftBox.style.transform = '';
                    animateSparkles();
                }, 100);
            }, 50);
        }, 500);
    }
    
    // Function to create confetti with better animation
    function createConfetti() {
        confettiContainer.innerHTML = '';
        const colors = ['#ff4081', '#3f51b5', '#4caf50', '#ff9800', '#9c27b0', '#ffeb3b', '#00bcd4', '#f44336'];
        const shapes = ['circle', 'square', 'triangle', 'star'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 10 + 5;
            
            confetti.style.backgroundColor = color;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = -20 + 'px';
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.opacity = Math.random() + 0.5;
            
            // Different shapes
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = size/2 + 'px solid transparent';
                confetti.style.borderRight = size/2 + 'px solid transparent';
                confetti.style.borderBottom = size + 'px solid ' + color;
            } else if (shape === 'star') {
                confetti.style.backgroundColor = 'transparent';
                confetti.innerHTML = '<i class="fas fa-star" style="color: ' + color + '; font-size: ' + size + 'px;"></i>';
            }
            
            // Animation properties
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 2;
            
            confetti.style.animation = `fall ${animationDuration}s linear ${animationDelay}s forwards`;
            
            // Add keyframes dynamically for more random movement
            const randomX = Math.random() * 200 - 100; // Random X movement between -100px and 100px
            const randomRotation = Math.random() * 720; // Random rotation
            
            const keyframes = `
                @keyframes fall {
                    0% { 
                        transform: translateY(0) translateX(0) rotate(0deg); 
                        opacity: 1;
                    }
                    25% { 
                        transform: translateY(${window.innerHeight * 0.25}px) translateX(${randomX * 0.25}px) rotate(${randomRotation * 0.25}deg); 
                    }
                    50% { 
                        transform: translateY(${window.innerHeight * 0.5}px) translateX(${randomX * 0.5}px) rotate(${randomRotation * 0.5}deg); 
                    }
                    75% { 
                        transform: translateY(${window.innerHeight * 0.75}px) translateX(${randomX * 0.75}px) rotate(${randomRotation * 0.75}deg); 
                    }
                    100% { 
                        transform: translateY(${window.innerHeight}px) translateX(${randomX}px) rotate(${randomRotation}deg); 
                        opacity: 0;
                    }
                }
            `;
            
            // Append style element if it doesn't exist
            if (!document.querySelector('#confetti-style-' + i)) {
                const styleElement = document.createElement('style');
                styleElement.id = 'confetti-style-' + i;
                document.head.appendChild(styleElement);
                styleElement.sheet.insertRule(keyframes, 0);
            }
            
            confettiContainer.appendChild(confetti);
        }
    }
    
    // Function to animate sparkles
    function animateSparkles() {
        sparkles.forEach(sparkle => {
            sparkle.style.animation = 'none';
            setTimeout(() => {
                sparkle.style.animation = 'twinkle 2s infinite';
            }, 10);
        });
    }
    
    // Function to create 3D effect on gift box
    function add3DEffect() {
        giftBox.addEventListener('mousemove', function(e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            giftBox.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        giftBox.addEventListener('mouseenter', function() {
            giftBox.style.transition = 'none';
        });
        
        giftBox.addEventListener('mouseleave', function() {
            giftBox.style.transition = 'all 0.5s ease';
            giftBox.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }
    
    // Function to show surprise with enhanced animation sequence
    function showSurprise() {
        popSound.play();
        celebrationSound.play();
        
        // Hide gift box with animation
        giftBox.style.transform = 'scale(1.2)';
        giftBox.style.opacity = '0';
        
        // Initialize balloons and confetti
        initBalloons();
        
        setTimeout(() => {
            giftBox.classList.add('hidden');
            surprise.classList.remove('hidden');
            
            // Add a small delay before showing the surprise with animation
            setTimeout(() => {
                // Set initial state for surprise elements
                document.querySelector('.surprise-text').style.opacity = '0';
                document.querySelector('.surprise-text').style.transform = 'scale(0)';
                document.querySelector('.name-text').style.opacity = '0';
                document.querySelector('.name-text').style.transform = 'translateY(50px)';
                document.querySelector('.cake').style.opacity = '0';
                document.querySelector('.cake').style.transform = 'translateX(-50%) scale(0)';
                replayButton.style.opacity = '0';
                replayButton.style.transform = 'scale(0)';
                
                // Create confetti after a small delay
                setTimeout(() => {
                    createConfetti();
                }, 300);
                
                // Animate elements in sequence
                setTimeout(() => {
                    document.querySelector('.surprise-text').style.opacity = '1';
                    document.querySelector('.surprise-text').style.transform = 'scale(1)';
                }, 500);
                
                setTimeout(() => {
                    document.querySelector('.name-text').style.opacity = '1';
                    document.querySelector('.name-text').style.transform = 'translateY(0)';
                }, 1000);
                
                setTimeout(() => {
                    document.querySelector('.cake').style.opacity = '1';
                    document.querySelector('.cake').style.transform = 'translateX(-50%) scale(1)';
                }, 1500);
                
                setTimeout(() => {
                    replayButton.style.opacity = '1';
                    replayButton.style.transform = 'scale(1)';
                    
                    // Show share section with animation
                    setTimeout(() => {
                        shareSection.classList.remove('hidden');
                        shareSection.style.opacity = '0';
                        shareSection.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            shareSection.style.opacity = '1';
                            shareSection.style.transform = 'translateY(0)';
                        }, 100);
                    }, 1000);
                }, 2000);
            }, 100);
        }, 500);
    }
    
    // Function to reset to gift box with animation
    function resetToGift() {
        // Play pop sound
        popSound.play();
        
        // Hide surprise with animation
        surprise.style.transform = 'scale(0.95)';
        surprise.style.opacity = '0';
        shareSection.style.opacity = '0';
        shareSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            surprise.classList.add('hidden');
            surprise.style.transform = '';
            surprise.style.opacity = '';
            shareSection.classList.add('hidden');
            
            // Show name input section again
            nameInputSection.classList.remove('hidden');
            nameInputSection.style.opacity = '0';
            nameInputSection.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                nameInputSection.style.opacity = '1';
                nameInputSection.style.transform = 'translateY(0)';
                // Clear the input field
                recipientNameInput.value = '';
            }, 100);
        }, 500);
    }
    
    // Add keyboard support for the name input
    recipientNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startSurprise();
        }
    });
    
    // Initialize
    checkUrlParams(); // Check for name in URL
    add3DEffect();
    
    // Event listeners
    startButton.addEventListener('click', startSurprise);
    giftBox.addEventListener('click', showSurprise);
    replayButton.addEventListener('click', resetToGift);
    copyButton.addEventListener('click', copyShareLink);
});
