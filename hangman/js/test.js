// Fade-in helper function
function fadeIn(element, duration = 1000) {
    element.style.opacity = 0;
    element.style.display = "block";
    let last = +new Date();
    const tick = function () {
        element.style.opacity = +element.style.opacity + (new Date() - last) / duration;
        last = +new Date();

        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
}

class Dice {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.rounds = 0;
        this.maxRounds = 3;

        this.rollButton = document.getElementById("roll-button");
        this.resetButton = document.getElementById("reset-button");
        this.winnerMessage = document.getElementById("winner-message");

        this.bindEvents();
        this.updateUI();
    }

    rollDice() {
        return Math.ceil(Math.random() * 6);
    }

    calculateRoundScore(dice1, dice2) {
        if (dice1 === 1 || dice2 === 1) return 0;
        if (dice1 === dice2) return (dice1 + dice2) * 2;
        return dice1 + dice2;
    }

    playRound() {
        if (this.rounds >= this.maxRounds) return;

        const playerDice1 = this.rollDice();
        const playerDice2 = this.rollDice();
        const computerDice1 = this.rollDice();
        const computerDice2 = this.rollDice();

        const playerRoundScore = this.calculateRoundScore(playerDice1, playerDice2);
        const computerRoundScore = this.calculateRoundScore(computerDice1, computerDice2);

        this.playerScore += playerRoundScore;
        this.computerScore += computerRoundScore;

        this.rounds++;

        document.getElementById("player-dice1").src = `dice${playerDice1}.png`;
        document.getElementById("player-dice2").src = `dice${playerDice2}.png`;
        document.getElementById("computer-dice1").src = `dice${computerDice1}.png`;
        document.getElementById("computer-dice2").src = `dice${computerDice2}.png`;

        document.getElementById("player-round-score").innerText = playerRoundScore;
        document.getElementById("computer-round-score").innerText = computerRoundScore;

        this.updateUI();

        if (this.rounds === this.maxRounds) this.determineWinner();
    }

    determineWinner() {
        const winnerImage = document.createElement("img");
        winnerImage.id = "winner-image";
        winnerImage.style.display = "none";
        winnerImage.style.position = "absolute";
        winnerImage.style.top = "50%";
        winnerImage.style.left = "50%";
        winnerImage.style.transform = "translate(-50%, -50%)";
        winnerImage.style.maxWidth = "300px";
        winnerImage.style.maxHeight = "300px";

        if (this.playerScore > this.computerScore) {
            this.winnerMessage.innerText = "Player Wins!";
            winnerImage.src = "image/playerwin.png";
        } else if (this.playerScore < this.computerScore) {
            this.winnerMessage.innerText = "Computer Wins!";
            winnerImage.src = "image/computerwin.png";
        } else {
            this.winnerMessage.innerText = "It's a Tie!";
            return; // No image displayed for ties
        }

        document.body.appendChild(winnerImage);
        fadeIn(winnerImage);
    }

    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.rounds = 0;
        this.winnerMessage.innerText = "";

        // Reset dice images to default
        document.getElementById("player-dice1").src = `dice1.png`;
        document.getElementById("player-dice2").src = `dice1.png`;
        document.getElementById("computer-dice1").src = `dice1.png`;
        document.getElementById("computer-dice2").src = `dice1.png`;

        // Remove winner image if it exists
        const winnerImage = document.getElementById("winner-image");
        if (winnerImage) {
            winnerImage.remove();
        }

        this.updateUI();
    }

    updateUI() {
        document.getElementById("player-total-score").innerText = this.playerScore;
        document.getElementById("computer-total-score").innerText = this.computerScore;
    }

    bindEvents() {
        this.rollButton.addEventListener("click", () => this.playRound());
        this.resetButton.addEventListener("click", () => this.resetGame());
    }
}

document.addEventListener("DOMContentLoaded", () => new Dice());
