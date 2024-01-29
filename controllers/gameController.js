import Game from "../models/Game.js";
import { checkWin, checkTie } from '../utils/gameLogic.js';

export const startNewGame = async (req, res) => {
  try {
    const newGame = new Game(); //create a new instance/documet of game model in memory
    await newGame.save(); //save newly created instance into DB
    res.status(201).json(newGame); //return the object
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const makeMove = async (req, res) => {
  // Validate move and update the game state
  const { gameId, position } = req.body; //will get two body parameters from front end that is sent when new-game api hit (position on the board and _id of the game that generate automatically by mongoServer)
  if (position < 0 || position > 8) { 
    //check for the position if it not lies on the board then return invalid position (bad request error)
    return res.status(400).json({ message: "Invalid board position." });
  }

  try {
    const game = await Game.findById(gameId); //finding the instance of Game from db
    if (!game || game.status !== "ongoing") {
        //checking the game is end or not
      return res
        .status(404)
        .json({ message: "Game not found or already finished." });
    }

    if (game.board[position] !== null) { //handling here for invalid move
      return res.status(400).json({
        reply: "AT",
        message: "Position already taken.",
      });
    }

    /*Make the move [null,null,null,null,null,null,null,null,null] now we are placing on position 0
    so this will change into [Player,null,null,null,null,null,null,null,null] player can be either X or O*/
    game.board[position] = game.currentPlayer;

    // Create helper function for win or tie which is in /utils/gameLogic.js
    if (checkWin(game.board)) { //passing argument (board) if it return true
      game.status = "won";
      game.winner = game.currentPlayer;
      await game.save();
      return res.status(200).send({
        status: game.status,
        player: game.currentPlayer,
      });
    } else {
      // Switch the current player
      game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
    }

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
