document.addEventListener("DOMContentLoaded", function() {
    let balance = parseFloat(prompt("Quanto vuoi caricare oggi?:")).toFixed(2);
    document.getElementById('currentBalance').textContent = `Saldo: ${balance}€`;

    document.getElementById('setup').style.display = 'none';
    document.getElementById('slotMachine').style.display = 'block';

    const symbols = ['J', 'Q', 'K', 'foto1', 'foto2', 'foto3', 'foto4'];
    const symbolImages = {
        'J': 'images/J.png',
        'Q': 'images/Q.png',
        'K': 'images/K.png',
        'foto1': 'images/foto1.png',
        'foto2': 'images/foto2.png',
        'foto3': 'images/foto3.png',
        'foto4': 'images/foto4.png',
    };

    const lines = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
    ];

    const payouts = {
        'J': {3: 0.5, 4: 1, 5: 1.5},
        'Q': {3: 0.75, 4: 1.5, 5: 2},
        'K': {3: 1, 4: 2, 5: 3},
        'foto1': {3: 2, 4: 5, 5: 10},
        'foto2': {3: 4, 4: 8, 5: 13},
        'foto3': {3: 5, 4: 10, 5: 15},
        'foto4': {3: 7.5, 4: 15, 5: 30},
    };

    const reels = Array.from(document.querySelectorAll('.reel'));
    let spinCount = 0; // Contatore dei giri effettuati
    let winCount = 0; // Contatore delle vincite negli ultimi 10 giri

    const spinButton = document.getElementById('spinButton');

    spinButton.addEventListener('click', function() {
        const result = document.getElementById('result');
        const betValue = confirmedBet;

        const currentBalance = parseFloat(document.getElementById('currentBalance').textContent.replace('Saldo: ', '').replace('€', ''));

        if (currentBalance < betValue) {
            alert("BROOO SEI STIRATOOOO!");
            return;
        }

        // Deduce la puntata dal saldo
        balance -= betValue;
        document.getElementById('currentBalance').textContent = `Saldo: ${balance.toFixed(2)}€`;

        spinButton.disabled = true;

        reels.forEach((reel, index) => {
            const spins = Math.floor(Math.random() * 20) + 20; // Numero casuale di rotazioni tra 20 e 39
            rotateReel(reel, spins, betValue, index === reels.length - 1);
        });
    });

    function rotateReel(reel, spins, betValue, isLastReel) {
        const img = reel.querySelector('img');
        const currentIndex = symbols.indexOf(img.alt);
        const targetIndex = (currentIndex + spins) % symbols.length;

        let currentSpin = 0;

        clearInterval(reel.timer);
        reel.timer = setInterval(() => {
            img.src = symbolImages[symbols[(currentIndex + currentSpin) % symbols.length]];
            img.alt = symbols[(currentIndex + currentSpin) % symbols.length];

            currentSpin++;

            if (currentSpin === spins) {
                clearInterval(reel.timer);
                if (isLastReel) {
                    checkWin();
                    spinButton.disabled = false;
                }
            }
        }, 100);
    }

    function checkWin() {
        const result = document.getElementById('result');
        let winnings = 0;
        let isWinningRound = false;

        spinCount++;
        if (spinCount % 10 === 0) {
            winCount = 0;
        }

        if (winCount < 4 && (spinCount % 10 - winCount) <= 6) {
            isWinningRound = true;
            winCount++;
        }

        lines.forEach(line => {
            const lineSymbols = line.map(index => document.getElementById(`reel${index + 1}`).querySelector('img').alt);
            const lineLength = countConsecutiveSymbols(lineSymbols);
            const firstSymbol = lineSymbols[0];
            const payout = payouts[firstSymbol][lineLength];

            if (isWinningRound && payout && lineLength >= 3 && lineSymbols.slice(0, lineLength).every(sym => sym.startsWith('foto') && sym === firstSymbol)) {
                winnings += payout * confirmedBet;
            }
        });

        if (winnings > 0) {
            result.textContent = `CASSAAAAA!! Hai vinto ${winnings.toFixed(2)}€!`;
            balance = (parseFloat(balance) + parseFloat(winnings)).toFixed(2);
        } else {
            result.textContent = 'Solo chi molla è un perdente!';
        }

        if (balance < 0) {
            balance = 0;
        }

        document.getElementById('currentBalance').textContent = `Saldo: ${balance}€`;
    }

    function countConsecutiveSymbols(arr) {
        let count = 1;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i - 1]) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }
});

let confirmedBet = 1;

function validateBetValue() {
    const value = parseFloat(document.getElementById('betInput').value);
    const betError = document.getElementById('betError');

    if (value < 0.5 || value > 100 || isNaN(value)) {
        betError.style.display = 'block';
    } else {
        betError.style.display = 'none';
        confirmedBet = value;
    }
}

function openBetPopup() {
    document.getElementById('betPopup').style.display = 'block';
}

function closeBetPopup() {
    document.getElementById('betPopup').style.display = 'none';
}

