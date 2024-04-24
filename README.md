# RockPaperScissors_Plus

RockPaperScissors_Plus is an advanced console-based variant of the traditional "Rock, Paper, Scissors" game, featuring enhanced gameplay mechanics and increased complexity. Unlike the classic game, which involves three basic moves, this version allows players to define a custom set of moves at the start, significantly expanding the strategic depth. The application also employs HMAC generation to ensure the integrity and fairness of the computer's move selection, adding a layer of security and trust to the game dynamics.

## Features

- **Enhanced Rules**: Players can choose any odd number of moves for the game.
- **Security**: Uses HMAC to ensure the fairness of the computer's move selection.
- **Additional Information**: After each game, the key used for the HMAC generation is displayed, allowing players to verify it.
- **Interactive Interface**: User input is handled through the console.

## Technologies

- Node.js
- Crypto (for HMAC)
- Readline-sync (for handling user input)
- CLI-table3 and Chalk (for vividly displaying the rules table in the console)

## Installation and Launch

Ensure you have Node.js installed (version 12 or higher).

1. Clone the repository:

```bash
git clone https://github.com/yourusername/RockPaperScissors_ProVersion.git
```
2. Install the necessary dependencies:

```bash
npm install
```

3. Start the game by specifying the desired elements separated by spaces:

```bash
node task_3.js rock paper scissors lizard spock

```

## How to Play
- Launch the game by specifying the desired set of figures.
- Follow the on-screen instructions to select a move.
- The game will inform you of the outcome of each round and display the key for verifying the HMAC.
