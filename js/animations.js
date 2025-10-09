// Animation controller for fade-in effects
class AnimationController {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Find all elements with fade-in classes
        this.elements = document.querySelectorAll([
            '.fade-in',
            '.fade-in-left',
            '.fade-in-right', 
            '.fade-in-up',
            '.fade-in-scale',
            '.fade-in-stagger'
        ].join(','));

        // Set up intersection observer
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Trigger when element is 50px from viewport
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.activateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all fade-in elements
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    activateElement(element) {
        // Add active class based on the fade-in type
        if (element.classList.contains('fade-in')) {
            element.classList.add('fade-in--active');
        } else if (element.classList.contains('fade-in-left')) {
            element.classList.add('fade-in-left--active');
        } else if (element.classList.contains('fade-in-right')) {
            element.classList.add('fade-in-right--active');
        } else if (element.classList.contains('fade-in-up')) {
            element.classList.add('fade-in-up--active');
        } else if (element.classList.contains('fade-in-scale')) {
            element.classList.add('fade-in-scale--active');
        } else if (element.classList.contains('fade-in-stagger')) {
            element.classList.add('fade-in-stagger--active');
        }
    }

    // Method to manually trigger animation for specific element
    triggerAnimation(element) {
        if (element) {
            this.activateElement(element);
        }
    }

    // Method to reset all animations
    resetAnimations() {
        this.elements.forEach(element => {
            element.classList.remove(
                'fade-in--active',
                'fade-in-left--active',
                'fade-in-right--active',
                'fade-in-up--active',
                'fade-in-scale--active',
                'fade-in-stagger--active'
            );
        });
    }

    // Method to add new elements to observe
    observeNewElements(elements) {
        elements.forEach(element => {
            this.elements.push(element);
            this.observer.observe(element);
        });
    }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
