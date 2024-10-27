class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.history = document.getElementById('history');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.memory = 0;
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.textContent));
        });

        // Operator buttons
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => this.handleOperator(button.dataset.action));
        });

        // Memory buttons
        document.querySelectorAll('.memory').forEach(button => {
            button.addEventListener('click', () => this.handleMemory(button.dataset.action));
        });

        // Function buttons
        document.querySelectorAll('.function').forEach(button => {
            button.addEventListener('click', () => this.handleFunction(button.dataset.action));
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
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
        if (this.operation !== null) this.calculate();
        this.previousValue = this.currentValue;
        this.operation = operator;
        this.shouldResetDisplay = true;
        this.updateHistory();
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
            case 'sqrt':
                result = Math.sqrt(current);
                break;
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
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
        }
        this.history.textContent = this.operation ? 
            `${this.previousValue} ${operatorSymbol}` : '';
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
