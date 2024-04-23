const crypto = require('crypto');
const readline = require('readline-sync');

class SecureRandomKeyGenerator {
    static generateKey(lengthInBytes) {
        return crypto.randomBytes(lengthInBytes);
    }
}

class HMACCalculator {
    static calculateHMAC(key, message) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(message);
        return hmac.digest('hex');
    }
}

class MovesValidator {
    static validateMoves(moves) {
        const uniqueMoves = new Set(moves);
        if (moves.length < 3) {
            throw new Error("Invalid input: There must be at least three moves. For example: rock, paper, scissors.");
        } else if (moves.length % 2 === 0) {
            throw new Error(`Invalid input: The number of moves must be odd. You provided ${moves.length} moves.`);
        } else if (uniqueMoves.size !== moves.length) {
            throw new Error("Invalid input: All moves must be unique. Please remove duplicate entries.");
        }
    }
}

class GameState {
    constructor(moves) {
        MovesValidator.validateMoves(moves);
        this.moves = moves;
        this.key = SecureRandomKeyGenerator.generateKey(32); // Generate a 256-bit key
        this.computerMove = this.moves[Math.floor(Math.random() * this.moves.length)];
    }
}

class GameLogic {
    constructor(state) {
        this.state = state;
    }

    determineWinner(userChoiceIndex) {
        const movesLength = this.state.moves.length;
        const halfLength = Math.floor(movesLength / 2);
        const computerChoiceIndex = this.state.moves.indexOf(this.state.computerMove);
        const result = Math.sign((computerChoiceIndex - userChoiceIndex + halfLength + movesLength) % movesLength - halfLength);

        return result === 1 ? 'You win!' : result === -1 ? 'You lose :(' : 'Draw!';
    }
}

class DisplayManager {
    constructor(state) {
        this.state = state;
    }

    displayHMAC() {
        const hmac = HMACCalculator.calculateHMAC(this.state.key.toString('hex'), this.state.computerMove);
        console.log(`HMAC: ${hmac}`);
    }

    displayMenu(moves) {
        console.log("Available moves:");
        moves.forEach((move, index) => {
            console.log(`${index + 1} - ${move}`);
        });
        console.log("0 - Exit");
        console.log("? - Help");
    }

    displayResults(userChoiceIndex, computerMove, result) {
        console.log(`Your move: ${this.state.moves[userChoiceIndex]}`);
        console.log(`Computer move: ${computerMove}`);
        console.log(result);
        console.log(`Secret key: ${this.state.key.toString('hex')}`);
        console.log("You can verify the HMAC using the following online tool: https://www.freeformatter.com/hmac-generator.html");
    }
}

class InputHandler {
    constructor(state, displayManager) {
        this.state = state;
        this.displayManager = displayManager;
    }

    getUserChoice() {
        this.displayManager.displayMenu(this.state.moves);

        let choice;
        while (true) {
            choice = readline.question("Enter your move: ");
            if (choice === '?') {
                console.log(RulesGenerator.generateRulesTable(this.state.moves));
                continue;
            }

            choice = parseInt(choice);
            if (!isNaN(choice) && choice >= 0 && choice <= this.state.moves.length) {
                break;
            }

            console.log("Incorrect input. Please select one of the provided options.");
        }

        return choice;
    }
}

class GameController {
    constructor(state, logic) {
        this.state = state;
        this.logic = logic;
        this.displayManager = new DisplayManager(state);
        this.inputHandler = new InputHandler(state, this.displayManager);
    }

    play() {
        this.displayManager.displayHMAC();
        const userChoiceIndex = this.inputHandler.getUserChoice() - 1;
        if (userChoiceIndex === -1) return;

        const result = this.logic.determineWinner(userChoiceIndex);
        this.displayManager.displayResults(userChoiceIndex, this.state.computerMove, result);
    }
}

const Table = require('cli-table3');
const chalk = require('chalk');

class RulesGenerator {
    static generateRulesTable(moves) {
        const table = new Table({
            head: ['User ↓ \\ PC →', ...moves],
            colWidths: new Array(moves.length + 1).fill(15),
            style: { head: [], border: [] },
        });

        moves.forEach((move, i) => {
            const row = [move];
            for (let j = 0; j < moves.length; j++) {
                let result;
                if (i === j) {
                    result = chalk.hex('#EDD19C')('Draw');
                } else if ((i - j + moves.length) % moves.length <= moves.length / 2) {
                    result = chalk.hex('#B57F7F')('Lose');
                } else {
                    result = chalk.hex('#7fb5b5')('Win');
                }
                row.push(result);
            }
            table.push(row);
        });

        return table.toString();
    }
}

try {
    const moves = process.argv.slice(2);
    const gameState = new GameState(moves);
    const gameLogic = new GameLogic(gameState);
    const gameController = new GameController(gameState, gameLogic);
    gameController.play();
} catch (error) {
    console.error(error.message);
}