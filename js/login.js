const signupForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const checkUsernameButton = document.getElementById('check-username');
const usernameFeedback = document.getElementById('username-feedback');
const passwordInput = document.getElementById('password');
const passwordFeedback = document.getElementById('password-feedback');
const confirmPasswordInput = document.getElementById('confirm-password');
const confirmPasswordFeedback = document.getElementById('confirm-password-feedback');

// 임시 사용자 데이터 (실제로는 서버에서 확인해야 함)
const existingUsernames = ['admin', 'user1', 'test'];

checkUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value;
    if (existingUsernames.includes(username)) {
        usernameFeedback.textContent = '이미 사용 중인 아이디입니다.';
        usernameFeedback.className = 'error';
    } else if (username) {
        usernameFeedback.textContent = '사용 가능한 아이디입니다.';
        usernameFeedback.className = 'success';
    }
});

const validatePassword = (password) => {
    // 숫자, 영어, 특수문자 포함 여부
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumber || !hasLetter || !hasSpecialChar) {
        return '숫자, 영어, 특수문자를 모두 포함해야 합니다.';
    }

    // 연속된 3자리 숫자나 알파벳 확인
    for (let i = 0; i < password.length - 2; i++) {
        const char1 = password.charCodeAt(i);
        const char2 = password.charCodeAt(i + 1);
        const char3 = password.charCodeAt(i + 2);

        if ((char2 === char1 + 1 && char3 === char2 + 1)) {
            return '연속된 3자리 숫자나 알파벳을 사용할 수 없습니다.';
        }
    }

    return null; // 유효한 비밀번호
};

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const errorMessage = validatePassword(password);

    if (errorMessage) {
        passwordFeedback.textContent = errorMessage;
        passwordFeedback.className = 'error';
    } else {
        passwordFeedback.textContent = '사용 가능한 비밀번호입니다.';
        passwordFeedback.className = 'success';
    }
});

confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value === confirmPasswordInput.value) {
        confirmPasswordFeedback.textContent = '비밀번호가 일치합니다.';
        confirmPasswordFeedback.className = 'success';
    } else {
        confirmPasswordFeedback.textContent = '비밀번호가 일치하지 않습니다.';
        confirmPasswordFeedback.className = 'error';
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isUsernameValid = usernameFeedback.className === 'success';
    const isPasswordValid = passwordFeedback.className === 'success';
    const isConfirmPasswordValid = confirmPasswordFeedback.className === 'success';

    if (isUsernameValid && isPasswordValid && isConfirmPasswordValid) {
        alert('회원가입 성공!');
        // 실제로는 여기서 서버로 폼 데이터를 전송합니다.
    } else {
        alert('입력 정보를 다시 확인해주세요.');
    }
});
