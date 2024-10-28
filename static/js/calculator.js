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
        const savedTheme = localStorage.getItem('calculatorTheme') || 'custom-background';
        
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

    initializeEventListeners() {
        // Safely add event listeners with null checks
        const addEventListenerSafely = (selector, eventType, callback) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.addEventListener(eventType, callback);
                }
            });
        };

        // Mode switching
        addEventListenerSafely('.btn-mode', 'click', (e) => this.switchMode(e.target));

        // Number buttons
        addEventListenerSafely('.number', 'click', (e) => this.appendNumber(e.target.textContent));

        // Operator buttons
        addEventListenerSafely('.operator', 'click', (e) => this.handleOperator(e.target.dataset.action));

        // Memory buttons
        addEventListenerSafely('.memory', 'click', (e) => this.handleMemory(e.target.dataset.action));

        // Function buttons
        addEventListenerSafely('.function', 'click', (e) => this.handleFunction(e.target.dataset.action));

        // Constant buttons
        addEventListenerSafely('.constant', 'click', (e) => this.appendNumber(e.target.dataset.value));

        // Equals button
        const equalsButton = document.querySelector('[data-action="calculate"]');
        if (equalsButton) {
            equalsButton.addEventListener('click', () => this.calculate());
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    initializeGraphingFeatures() {
        const plotBtn = document.getElementById('plot-btn');
        if (plotBtn) {
            plotBtn.addEventListener('click', () => this.plotFunction());
        }
    }

    switchMode(button) {
        if (!button) return;
        
        const allModeButtons = document.querySelectorAll('.btn-mode');
        allModeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const mode = button.dataset.mode;
        const elements = {
            basicGrid: document.querySelector('.basic-grid'),
            scientificGrid: document.querySelector('.scientific-grid'),
            graphingInterface: document.querySelector('.graphing-interface'),
            displayContainer: document.querySelector('.display-container')
        };
        
        if (elements.basicGrid) elements.basicGrid.classList.toggle('hide', mode !== 'basic');
        if (elements.scientificGrid) elements.scientificGrid.classList.toggle('hide', mode !== 'scientific');
        if (elements.graphingInterface) elements.graphingInterface.classList.toggle('hide', mode !== 'graphing');
        if (elements.displayContainer) elements.displayContainer.classList.toggle('hide', mode === 'graphing');
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentValue = '';
            this.shouldResetDisplay = false;
        }
        if (number === '.' && this.currentValue.includes('.')) return;
        if (this.currentValue === '0' && number !== '.') {
            this.currentValue = number;
        } else {
            this.currentValue += number;
        }
        this.updateDisplay();
    }

    handleOperator(operator) {
        if (operator === 'sqrt' || operator === 'sin' || operator === 'cos' || 
            operator === 'tan' || operator === 'log' || operator === 'ln' || 
            operator === 'exp' || operator === 'square' || operator === 'inverse' ||
            operator === 'factorial') {
            this.calculateUnary(operator);
            return;
        }

        if (this.operation !== null) this.calculate();
        this.previousValue = this.currentValue;
        this.operation = operator;
        this.shouldResetDisplay = true;
        this.updateHistory();
    }

    calculateUnary(operator) {
        const value = parseFloat(this.currentValue);
        let result;

        switch(operator) {
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'square':
                result = value * value;
                break;
            case 'inverse':
                result = 1 / value;
                break;
            case 'factorial':
                result = this.factorial(value);
                break;
        }

        this.currentValue = result.toString();
        this.updateDisplay();
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    calculate() {
        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        switch(this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                result = prev / current;
                break;
            case 'power':
                result = Math.pow(prev, current);
                break;
            case 'percent':
                result = prev * (current / 100);
                break;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
        this.updateHistory();
    }

    handleMemory(action) {
        switch(action) {
            case 'mc':
                this.memory = 0;
                this.memoryIndicator.style.opacity = '0';
                break;
            case 'mr':
                this.currentValue = this.memory.toString();
                break;
            case 'm-plus':
                this.memory += parseFloat(this.currentValue);
                this.memoryIndicator.style.opacity = '1';
                break;
            case 'm-minus':
                this.memory -= parseFloat(this.currentValue);
                this.memoryIndicator.style.opacity = '1';
                break;
        }
        this.updateDisplay();
    }

    handleFunction(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.currentValue = this.currentValue.slice(0, -1) || '0';
                this.updateDisplay();
                break;
            case 'toggle-sign':
                this.currentValue = (parseFloat(this.currentValue) * -1).toString();
                this.updateDisplay();
                break;
        }
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            this.appendNumber(e.key);
        }
        if (e.key === '+') this.handleOperator('add');
        if (e.key === '-') this.handleOperator('subtract');
        if (e.key === '*') this.handleOperator('multiply');
        if (e.key === '/') this.handleOperator('divide');
        if (e.key === 'Enter') this.calculate();
        if (e.key === 'Escape') this.clear();
        if (e.key === 'Backspace') this.handleFunction('backspace');
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.updateDisplay();
        this.history.textContent = '';
    }

    updateDisplay() {
        this.display.value = this.currentValue;
    }

    updateHistory() {
        let operatorSymbol = '';
        switch(this.operation) {
            case 'add': operatorSymbol = '+'; break;
            case 'subtract': operatorSymbol = '-'; break;
            case 'multiply': operatorSymbol = '×'; break;
            case 'divide': operatorSymbol = '÷'; break;
            case 'power': operatorSymbol = '^'; break;
            case 'percent': operatorSymbol = '%'; break;
        }
        this.history.textContent = this.operation ? 
            `${this.previousValue} ${operatorSymbol}` : '';
    }

    async plotFunction() {
        const functionInput = document.getElementById('function-input');
        const xMin = parseFloat(document.getElementById('x-min').value);
        const xMax = parseFloat(document.getElementById('x-max').value);

        if (!functionInput.value) {
            alert('Please enter a function to plot');
            return;
        }

        try {
            const response = await fetch('/plot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expression: functionInput.value,
                    range: [xMin, xMax]
                })
            });

            const data = await response.json();
            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }

            const plotData = JSON.parse(data.plot);
            Plotly.newPlot('plot-area', plotData.data, plotData.layout);
        } catch (error) {
            alert('Error plotting function: ' + error.message);
        }
    }
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
