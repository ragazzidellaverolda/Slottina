document.addEventListener("DOMContentLoaded", function() {
    // Set initial balance
    let balance = parseInt(prompt("Choose your starting balance:"));
    document.getElementById('currentBalance').textContent = `Current Balance: $${balance}`;

    // Hide setup, show slot machine
    document.getElementById('setup').style.display = 'none';
    document.getElementById('slotMachine').style.display = 'block';

    // Symbol definitions
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

    // Lines definition
    const lines = [
        [0, 1, 2, 3, 4], // Top row
        [5, 6, 7, 8, 9], // Middle row
        [10, 11, 12, 13, 14], // Bottom row
    ];

    // Symbol payouts (multipliers)
    const payouts = {
        'J': {3: 1, 4: 5, 5: 10},
        'Q': {3: 2, 4: 10, 5: 20},
        'K': {3: 3, 4: 15, 5: 30},
        'foto1': {3: 5, 4: 20, 5: 40},
        'foto2': {3: 10, 4: 30, 5: 60},
        'foto3': {3: 20, 4: 40, 5: 80},
        'foto4': {3: 50, 4: 100, 5: 200},
    };

    // Spin button event listener
    document.getElementById('spinButton').addEventListener('click', function() {
        const result = document.getElementById('result');
        const betValue = confirmedBet; // Utilizza la puntata confermata

        const currentBalance = parseInt(document.getElementById('currentBalance').textContent.replace('Current Balance: $', ''));
        
        if (currentBalance < betValue) {
            alert("You don't have enough balance!");
            return;
        }

        // Disable spin button during spin
        document.getElementById('spinButton').disabled = true;

        // Change images on reels
        const reels = Array.from(document.querySelectorAll('.reel'));
        reels.forEach(reel => {
            const symbolIndex = Math.floor(Math.random() * symbols.length);
            const symbol = symbols[symbolIndex];
            const img = reel.querySelector('img');
            img.src = symbolImages[symbol];
            img.alt = symbol;
        });

        // Evaluate spin result
        let winnings = 0;
        lines.forEach(line => {
            const lineSymbols = line.map(index => reels[index].querySelector('img').alt);
            const lineLength = countConsecutiveSymbols(lineSymbols);
            const firstSymbol = lineSymbols[0];
            const payout = payouts[firstSymbol][lineLength];
            if (payout) {
                winnings += payout * betValue; // Multiply payout by bet value
            }
        });

        if (winnings > 0) {
            result.textContent = `You Win! You earned $${winnings}!`;
            balance += winnings;
        } else {
            result.textContent = 'Try Again!';
            balance -= betValue;
        }

        // Update balance display   
        document.getElementById('currentBalance').textContent = `Current Balance: $${balance}`;

        // Re-enable spin button after spin
        document.getElementById('spinButton').disabled = false;
    });
});


// Variabile per memorizzare la puntata confermata
let confirmedBet = 1;

// Funzione per aggiornare il valore della puntata
function updateBetValue() {
    const value = document.getElementById('betRange').value;
    document.getElementById('betValue').textContent = value;
    confirmedBet = parseInt(value); // Aggiorna la puntata confermata
}

// Funzione per aprire il popup della puntata
function openBetPopup() {
    document.getElementById('betPopup').style.display = 'block';
}

// Funzione per chiudere il popup della puntata
function closeBetPopup() {
    document.getElementById('betPopup').style.display = 'none';
}

// Funzione per contare le occorrenze consecutive di un elemento in un array
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

// Funzione per gestire il pulsante di spin
function handleSpin() {
    const currentBalance = parseInt(document.getElementById('currentBalance').textContent.replace('Current Balance: $', ''));
    
    if (currentBalance < confirmedBet) {
        alert("You don't have enough balance!");
        return;
    }

    // Aggiorna il saldo e avvia il giro
    const newBalance = currentBalance - confirmedBet;
    document.getElementById('currentBalance').textContent = `Current Balance: $${newBalance}`;
    spin();
}

// Funzione per confermare la puntata
function confirmBet() {
    confirmedBet = parseInt(document.getElementById('betValue').textContent);
    closeBetPopup();
}
