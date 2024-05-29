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

    document.getElementById('spinButton').addEventListener('click', function() {
        const result = document.getElementById('result');
        const betValue = confirmedBet;

        const currentBalance = parseFloat(document.getElementById('currentBalance').textContent.replace('Saldo: ', '').replace('€', ''));

        if (currentBalance < betValue) {
            alert("BROOO SEI STIRATOOOO!");
            return;
        }

        document.getElementById('spinButton').disabled = true;

        const reels = Array.from(document.querySelectorAll('.reel'));
        reels.forEach(reel => {
            const symbolIndex = Math.floor(Math.random() * symbols.length);
            const symbol = symbols[symbolIndex];
            const img = reel.querySelector('img');
            img.src = symbolImages[symbol];
            img.alt = symbol;
        });

        let winnings = 0;
        lines.forEach(line => {
            const lineSymbols = line.map(index => reels[index].querySelector('img').alt);
            const lineLength = countConsecutiveSymbols(lineSymbols);
            const firstSymbol = lineSymbols[0];
            const payout = payouts[firstSymbol][lineLength];
            if (payout) {
                winnings += payout * betValue;
            }
        });

        if (winnings > 0) {
            result.textContent = `CASSAAAAA!! hai vinto ${winnings}€ !`;
            balance = (parseFloat(balance) + parseFloat(winnings)).toFixed(2);
        } else {
            result.textContent = 'Solo chi molla è un perdente!';
            balance = (parseFloat(balance) - parseFloat(betValue)).toFixed(2);
        }

        if (balance < 0) {
            balance = 0;
        }

        document.getElementById('currentBalance').textContent = `Saldo: ${balance}€`;

        document.getElementById('spinButton').disabled = false;
    });
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

function handleSpin() {
    const currentBalance = parseFloat(document.getElementById('currentBalance').textContent.replace('Saldo: ', '').replace('€', ''));

    if (currentBalance < confirmedBet) {
        alert("BROOO SEI STIRATOOOO!");
        return;
    }

    const newBalance = (currentBalance - confirmedBet).toFixed(2);
    document.getElementById('currentBalance').textContent = `Saldo: ${newBalance}€`;
    spin();
}

function confirmBet() {
    validateBetValue();
    if (document.getElementById('betError').style.display === 'none') {
        closeBetPopup();
    }
}
