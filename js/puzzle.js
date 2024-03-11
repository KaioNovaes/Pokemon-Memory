document.addEventListener("DOMContentLoaded", () => {
    const generateRandomIds = (count, min, max) => {
        const randomIds = [];
        while (randomIds.length < count) {
            const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!randomIds.includes(randomId)) {
                randomIds.push(randomId);
            }
        }
        return randomIds;
    }

    const countCards = 10;
    let timerInterval;

    const startButton = document.getElementById("start-btn");
    const restartButton = document.getElementById("restart-btn");
    const overlay = document.querySelector(".overlay");
    const hideOverlayAndStartGame = () => {
        overlay.style.display = "none";
        startTimer(3);
    };
    startButton.addEventListener("click", hideOverlayAndStartGame);
    
    let originalCards = generateRandomIds(countCards, 1, 1010).map(id => ({ id }));
    let doubledCards = [...originalCards, ...originalCards];
    doubledCards.sort(() => 0.5 - Math.random());
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    const preloadedImages = [];
    const board = document.querySelector('.board');
    const timerElement = document.getElementById("timer");

    const fetchPokemon = async (pokemon) => {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = await APIResponse.json();
        return data;
    }

    originalCards.forEach(async (card) => {
        const data = await fetchPokemon(card.id);
        const imageUrl = data.sprites.other['official-artwork'].front_default;
        const img = new Image();
        img.src = imageUrl;
        preloadedImages.push(img);
    });
   
    const startTimer = (durationInMinutes) => {
        const startTime = Date.now();
        const updateTimer = () => {
            const currentTime = Date.now();
            const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
    
            if (overlay.style.display === 'none') {
                const minutes = Math.floor(elapsedTimeInSeconds / 60);
                const seconds = elapsedTimeInSeconds % 60;
                const minutesDisplay = String(minutes).padStart(2, '0');
                const secondsDisplay = String(seconds).padStart(2, '0');
                timerElement.textContent = `${minutesDisplay}:${secondsDisplay}`;
            } else {
                clearInterval(timerInterval);
            }
        };
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    };

    const createBoard = async (cards) => {
        const numCards = cards.length;
        let maxWidth, initialImageSize;
        if (countCards <= 10) {
            maxWidth = 605;
            initialImageSize = 105;
        } else if (countCards > 10 && countCards <= 20) {
            maxWidth = 965;
            initialImageSize = 100;
        } else if (countCards > 20 && countCards <= 40) {
            maxWidth = 1692;
            initialImageSize = 85;
        } else {
            maxWidth = 1200;
            initialImageSize = 62;
        }
        const board = document.querySelector('.board');
        board.innerHTML = '';
        for (let i = 0; i < numCards; i++) {
            const card = document.createElement('img');
            card.setAttribute('src', 'assets/img/POKEBALL.png');
            card.setAttribute('data-id', i);
            card.addEventListener('click', flipCard);
            card.style.width = `${initialImageSize}px`;
            card.style.height = `${initialImageSize}px`;
            board.appendChild(card);
        }
        board.style.maxWidth = `${maxWidth}px`;
    };

    const showGameOverPanel = () => {
        const gameOverPanel = document.querySelector('.game-over-mode');
        const congratulationsMessage = document.getElementById('congratulations-message');
        congratulationsMessage.textContent = `Congratulations! You found all the pairs in ${timerElement.textContent}!`;
        gameOverPanel.style.display = 'flex';
    };
    const resetGame = async function () {
        clearInterval(timerInterval);
        timerElement.textContent = '00:00';
        board.innerHTML = '';
        cardsChosen = [];
        cardsChosenId = [];
        cardsWon = [];
        originalCards = generateRandomIds(countCards, 1, 1010).map(id => ({ id }));
        doubledCards = [...originalCards, ...originalCards];
        doubledCards.sort(() => 0.5 - Math.random());
        preloadedImages.length = 0;
        originalCards.forEach(async (card) => {
            const data = await fetchPokemon(card.id);
            const imageUrl = data.sprites.other['official-artwork'].front_default;
            const img = new Image();
            img.src = imageUrl;
            preloadedImages.push(img);
        });
        startTimer(3);
        await createBoard(doubledCards);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    restartButton.addEventListener("click", () => {
        resetGame();
        const gameOverPanel = document.querySelector('.game-over-mode');
        gameOverPanel.style.display = 'none';
    });

    const flipCard = async function () {
        if (cardsChosen.length < 2 && !this.classList.contains('pokemon') && !cardsWon.includes(cardsChosen[0])) {
            let cardId = this.getAttribute('data-id');
            if (this.getAttribute('src') === 'assets/img/checkImg.png') {
                return;
            }
            cardsChosen.push(doubledCards[cardId].id);
            cardsChosenId.push(cardId);
            this.classList.add('pokemon');
            const data = await fetchPokemon(doubledCards[cardId].id);
            this.setAttribute('src', data.sprites.other['official-artwork'].front_default);
            if (cardsChosen.length === 2) {
                board.style.pointerEvents = 'none';
                setTimeout(checkForMatch, 500);
            }
        }
    }

    const checkForMatch = function () {
        const cards = document.querySelectorAll('img');
        const [id1, id2] = cardsChosenId;
        if (cardsChosen[0] === cardsChosen[1] && id1 !== id2) {
            cards[id1].setAttribute('src', 'assets/img/checkImg.png');
            cards[id2].setAttribute('src', 'assets/img/checkImg.png');
            cards[id1].classList.add('sameImg');
            cards[id2].classList.add('sameImg');
            cardsWon.push(cardsChosen[0]);
        } else {
            setTimeout(() => {
                cards[id1].setAttribute('src', 'assets/img/POKEBALL.png');
                cards[id2].setAttribute('src', 'assets/img/POKEBALL.png');
                cards[id1].classList.remove('pokemon');
                cards[id2].classList.remove('pokemon');
            }, 0.3);
        }
        cardsChosen = [];
        cardsChosenId = [];
        setTimeout(() => {
            board.style.pointerEvents = 'auto';
        }, 0.2);
    
        if (cardsWon.length === doubledCards.length / 2) {
            showGameOverPanel();
            clearInterval(timerInterval);
        }
    };

    createBoard(doubledCards);
});