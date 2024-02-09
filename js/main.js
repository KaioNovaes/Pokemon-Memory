const backBtn = document.querySelector('.backBtn');
const saveBtn = document.querySelector('.saveBtn');
const wrapper = document.querySelector('.wrapper');
const nicknameInput = document.getElementById('nickname');
const nicknameAlert = document.getElementById('nicknameAlert');
const gameGuessImageButton = document.getElementById('game-guessImage');
const gameGuessNameButton = document.getElementById('game-guessName');
const gamePuzzleButton = document.getElementById('game-puzzle');

saveBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const trimmedNickname = nicknameInput.value.trim();

    if (trimmedNickname !== null && trimmedNickname !== '') {
        wrapper.classList.toggle('active');
        nicknameAlert.classList.remove('withBorder');
    } else {
        wrapper.classList.remove('active');
        nicknameAlert.classList.add('withBorder');
        nicknameAlert.textContent = 'Please enter a nickname.';
    }
});

backBtn.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

gameGuessImageButton.addEventListener('click', (event) => {
    event.preventDefault();
    // Lógica para o botão 'game-guessImage'
});

gamePuzzleButton.addEventListener('click', (event) => {
    event.preventDefault();
    // Lógica para o botão 'game-puzzle'
});

gameGuessNameButton.addEventListener('click', (event) => {
    event.preventDefault();
    // Lógica para o botão 'game-guessName'
});