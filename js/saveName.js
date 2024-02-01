const backBtn = document.querySelector('.backBtn');
const saveBtn = document.querySelector('.saveBtn');
const wrapper = document.querySelector('.wrapper');
const nicknameInput = document.getElementById('nickname');

saveBtn.addEventListener('click', (event) => {
    if (nicknameInput.value.trim() != '') {
        wrapper.classList.toggle('active');
    }
});

backBtn.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});