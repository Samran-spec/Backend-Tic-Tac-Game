import mongoose from "mongoose";

//creating database schama
const gameSchema = new mongoose.Schema({
    board: {
        type: [String],
        default: Array(9).fill(null) //placing the size of board into the database
    },
    currentPlayer: {
        type: String,
        default: 'X' //every time the default player will be X
    },
    status: {
        type: String,
        default: 'ongoing', // Possible values: 'ongoing', 'won', 'tied'
    },
    winner: {
        type: String,
        default: ''
    }
});

const Game = mongoose.model('Game', gameSchema);

export default Game; 