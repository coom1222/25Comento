document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '';
    let operator = null;
    let previousInput = '';
    let resultDisplayed = false; // To handle continuous operations after '='

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value >= '0' && value <= '9') {
                if (resultDisplayed) {
                    currentInput = value;
                    resultDisplayed = false;
                } else {
                    currentInput += value;
                }
            } else if (['+', '-', '×', '÷'].includes(value)) {
                if (currentInput === '' && previousInput === '') return; // Prevent starting with an operator

                if (previousInput !== '' && operator !== null && currentInput !== '') {
                    // If there's a previous operation pending and current input is not empty, calculate it first
                    calculate();
                    previousInput = display.textContent; // Use the result as the new previous input
                } else if (currentInput !== '') {
                    previousInput = currentInput;
                }
                operator = value;
                currentInput = '';
                resultDisplayed = false;
            } else if (value === '=') {
                if (currentInput === '' || previousInput === '' || operator === null) return; // Not enough operands/operator
                calculate();
                operator = null;
                resultDisplayed = true;
            } else if (value === 'AC') {
                currentInput = '';
                operator = null;
                previousInput = '';
                resultDisplayed = false;
            } else if (value === '.') {
                if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
            } else if (value === '+/-') {
                if (currentInput !== '') {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                }
            } else if (value === '%') {
                if (currentInput !== '') {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
            }
            updateDisplay();
        });
    });

    const calculate = () => {
        let calculation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return; // Ensure valid numbers

        switch (operator) {
            case '+':
                calculation = prev + current;
                break;
            case '-':
                calculation = prev - current;
                break;
            case '×':
                calculation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("0으로 나눌 수 없습니다!");
                    calculation = 'Error';
                } else {
                    calculation = prev / current;
                }
                break;
            default:
                return;
        }
        currentInput = calculation.toString();
        previousInput = '';
        operator = null;
    };

    const updateDisplay = () => {
        if (currentInput !== '') {
            display.textContent = currentInput;
        } else if (operator !== null && previousInput !== '') {
            display.textContent = `${previousInput} ${operator}`;
        } else if (previousInput !== '') {
            display.textContent = previousInput;
        } else {
            display.textContent = '0';
        }
    };

    updateDisplay(); // Initial display
});
