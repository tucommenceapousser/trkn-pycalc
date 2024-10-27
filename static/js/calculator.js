// Calculator class definition
class Calculator {
    constructor() {
        this.initializeElements();
        this.initializeState();
    }

    initializeElements() {
        // Initialize elements with null checks
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        
        if (!this.display || !this.history || !this.memoryIndicator) {
            console.error('Required elements not found. Waiting for DOM...');
            return false;
        }
        return true;
    }

    initializeState() {
        this.memory = 0;
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    initialize() {
        if (this.initializeElements()) {
            this.initializeEventListeners();
            this.initializeGraphingFeatures();
            this.initializeThemeSelector();
            return true;
        }
        return false;
    }

    initializeThemeSelector() {
        const themeSelect = document.getElementById('themeSelect');
        if (!themeSelect) {
            console.error('Theme selector not found');
            return;
        }

        // Load saved theme or use default
        const savedTheme = localStorage.getItem('calculatorTheme') || 'blue-pink';
        
        // Set initial theme
        this.setTheme(savedTheme);
        themeSelect.value = savedTheme;

        // Add change event listener
        themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('calculatorTheme', theme);
    }

    // Rest of the Calculator class methods remain unchanged...
    [The rest of the calculator.js file remains the same...]
}

// Initialize calculator when DOM is loaded
let calculatorInstance = null;
const initializeCalculator = () => {
    if (!calculatorInstance) {
        calculatorInstance = new Calculator();
    }
    if (!calculatorInstance.initialize()) {
        // If initialization fails, retry after a short delay
        setTimeout(initializeCalculator, 100);
    }
};

// Ensure DOM is fully loaded before initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
    initializeCalculator();
}
