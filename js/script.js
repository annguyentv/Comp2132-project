function fadeIn(element, duration = 3000) {
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

        const rollDuration = 1000; 
        const intervalTime = 100; 
        let elapsedTime = 0;


        const playerDice1Element = document.getElementById("player-dice1");
        const playerDice2Element = document.getElementById("player-dice2");
        const computerDice1Element = document.getElementById("computer-dice1");
        const computerDice2Element = document.getElementById("computer-dice2");

        const randomDiceFace = () => Math.ceil(Math.random() * 6);

        const animationInterval = setInterval(() => {
            playerDice1Element.src = `image/dice${randomDiceFace()}.png`;
            playerDice2Element.src = `image/dice${randomDiceFace()}.png`;
            computerDice1Element.src = `image/dice${randomDiceFace()}.png`;
            computerDice2Element.src = `image/dice${randomDiceFace()}.png`;

            elapsedTime += intervalTime;

            if (elapsedTime >= rollDuration) {
                clearInterval(animationInterval);


                const playerDice1 = this.rollDice();
                const playerDice2 = this.rollDice();
                const computerDice1 = this.rollDice();
                const computerDice2 = this.rollDice();

                const playerRoundScore = this.calculateRoundScore(playerDice1, playerDice2);
                const computerRoundScore = this.calculateRoundScore(computerDice1, computerDice2);

                this.playerScore += playerRoundScore;
                this.computerScore += computerRoundScore;

                playerDice1Element.src = `image/dice${playerDice1}.png`;
                playerDice2Element.src = `image/dice${playerDice2}.png`;
                computerDice1Element.src = `image/dice${computerDice1}.png`;
                computerDice2Element.src = `image/dice${computerDice2}.png`;

                document.getElementById("player-round-score").innerText = playerRoundScore;
                document.getElementById("computer-round-score").innerText = computerRoundScore;

                this.rounds++;

                this.updateUI();
                if (this.rounds === this.maxRounds) this.determineWinner();
            }
        }, intervalTime);
    }

    determineWinner() {
        const mainElement = document.getElementById("game");
        const winnerMessageElement = document.createElement("div");
        winnerMessageElement.id = "winner-congratulations";
        if (this.playerScore > this.computerScore) {
            winnerMessageElement.innerHTML = "<b>Congratulation</b><br>Player Wins!";
        } else if (this.playerScore < this.computerScore) {
            winnerMessageElement.innerHTML = "<b>Congratulation</b><br>Computer Wins!";
        } else {
            this.winnerMessage.innerText = "It's a Tie!";
            return;
        }

        const winnerImage = document.createElement("img");
        winnerImage.src = "image/trophy.png";
        winnerImage.alt = "Winner Image";

        winnerMessageElement.appendChild(winnerImage);

        mainElement.appendChild(winnerMessageElement);
        fadeIn(winnerMessageElement);
    }

    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.rounds = 0;
        this.winnerMessage.innerText = "";

        document.getElementById("player-dice1").src = `image/dice1.png`;
        document.getElementById("player-dice2").src = `image/dice1.png`;
        document.getElementById("computer-dice1").src = `image/dice1.png`;
        document.getElementById("computer-dice2").src = `image/dice1.png`;


        const winnerMessageElement = document.getElementById("winner-congratulations");
        if (winnerMessageElement) {
            winnerMessageElement.remove();
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
