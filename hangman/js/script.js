class HangmanGame {
    constructor() {
        this.words = [
            { word: "javascript", hint: "Programming language" },
            { word: "hangman", hint: "This game" },
            { word: "browser", hint: "Where this game is running" },
            { word: "keyboard", hint: "Input device" },
            { word: "monitor", hint: "Output device" }
        ];
        this.maxWrongGuesses = 6;

        this.resetButton = document.getElementById("reset-button");
        this.guessButton = document.getElementById("guess-button");
        this.letterInput = document.getElementById("letter");
        this.hangmanImage = document.getElementById("hangman-image");
        this.hintText = document.getElementById("hint-text");
        this.wordDisplay = document.getElementById("word-display");
        this.wrongGuessesDisplay = document.getElementById("wrong-guesses");
        this.resultMessage = document.getElementById("result-message");

        this.init();
    }

    init() {
        this.chooseWord();
        this.wrongGuesses = [];
        this.correctGuesses = new Set();
        this.remainingGuesses = this.maxWrongGuesses;

        this.updateDisplay();
        this.bindEvents();
    }

    bindEvents() {
        this.guessButton.addEventListener("click", () => this.handleGuess());
        this.resetButton.addEventListener("click", () => this.resetGame());
        this.letterInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.handleGuess();
        });
    }

    chooseWord() {
        const randomIndex = Math.floor(Math.random() * this.words.length);
        this.currentWord = this.words[randomIndex].word.toLowerCase();
        this.currentHint = this.words[randomIndex].hint;

        this.hintText.innerText = this.currentHint;
        this.wordDisplay.innerText = "_ ".repeat(this.currentWord.length).trim();
    }

    handleGuess() {
        const guess = this.letterInput.value.toLowerCase();
        this.letterInput.value = "";

        if (!guess || guess.length !== 1 || this.wrongGuesses.includes(guess) || this.correctGuesses.has(guess)) {
            return;
        }

        if (this.currentWord.includes(guess)) {
            this.correctGuesses.add(guess);
        } else {
            this.wrongGuesses.push(guess);
            this.remainingGuesses--;
        }

        this.updateDisplay();
        this.checkGameOver();
    }

    updateDisplay() {
        // Update word display
        const displayedWord = this.currentWord
            .split("")
            .map((letter) => (this.correctGuesses.has(letter) ? letter : "_"))
            .join(" ");
        this.wordDisplay.innerText = displayedWord;

        // Update wrong guesses
        this.wrongGuessesDisplay.innerText = this.wrongGuesses.join(", ");

        // Update hangman image
        this.hangmanImage.src = `hangman${this.maxWrongGuesses - this.remainingGuesses}.png`;
    }

    checkGameOver() {
        if (this.remainingGuesses === 0) {
            this.resultMessage.innerText = `You lost! The word was "${this.currentWord}".`;
            this.endGame();
        } else if (!this.wordDisplay.innerText.includes("_")) {
            this.resultMessage.innerText = "Congratulations! You guessed the word!";
            this.endGame();
        }
    }

    endGame() {
        this.guessButton.disabled = true;
        this.letterInput.disabled = true;
    }

    resetGame() {
        this.guessButton.disabled = false;
        this.letterInput.disabled = false;
        this.resultMessage.innerText = "";
        this.init();
    }
}

document.addEventListener("DOMContentLoaded", () => new HangmanGame());
