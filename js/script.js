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

    const countCards = 18;

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
            const minutes = Math.floor(elapsedTimeInSeconds / 60);
            const seconds = elapsedTimeInSeconds % 60;
            const minutesDisplay = String(minutes).padStart(2, '0');
            const secondsDisplay = String(seconds).padStart(2, '0');
            timerElement.textContent = `${minutesDisplay}:${secondsDisplay}`;
            requestAnimationFrame(updateTimer);
        };
        updateTimer();
    };

    const createBoard = async (cards) => {
        const numCards = cards.length;
        let maxWidth, initialImageSize;
        startTimer(3);
        if (countCards <= 10) {
            maxWidth = 610;
            initialImageSize = 110;
        } else if (countCards <= 20 && countCards < 40) {
            maxWidth = 650;
            initialImageSize = 85;
        } else {
            maxWidth = 1030;
            initialImageSize = 75;
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

    const resetGame = async function () {
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
        await createBoard(doubledCards);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    const flipCard = async function () {
        if (cardsChosen.length < 2 && !this.classList.contains('pokemon')) {
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
            const elapsedTimeFormatted = timerElement.textContent;
            alert(`Parabéns! Você encontrou todos os pares em ${elapsedTimeFormatted}!`);
            setTimeout(() => {
                resetGame();
            }, 0.3);
        }
    }

    createBoard(doubledCards);
});