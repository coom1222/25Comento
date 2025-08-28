document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display'); // 모든 버튼 클릭을 바인딩, 스트 콘텐츠로 버튼 기능을 슬라이싱
    const buttons = document.querySelectorAll('.button');

    let currentInput = '';
    let operator = null;
    let previousInput = '';
    let resultDisplayed = false; // To handle continuous operations after '='

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value >= '0' && value <= '9') { // 숫자 입력
                if (resultDisplayed) {
                    currentInput = value;
                    resultDisplayed = false;
                } else {
                    currentInput += value;
                }
            } else if (['+', '-', '×', '÷'].includes(value)) {  // 연산자 입력
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
            } else if (value === '=') { // = 연산자가 입력되면 calculate() 호출
                if (currentInput === '' || previousInput === '' || operator === null) return; // Not enough operands/operator
                calculate();
                operator = null;
                resultDisplayed = true;
            } else if (value === 'AC') {
                currentInput = '';
                operator = null;
                previousInput = '';
                resultDisplayed = false;
            } else if (value === '.') { // 소숫점 중복 방지
                if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
            } else if (value === '+/-') {   // 부호 반전
                if (currentInput !== '') {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                }
            } else if (value === '%') { // 백분율
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
