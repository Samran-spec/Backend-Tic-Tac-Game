import { startNewGame, makeMove } from "../controllers/gameController";

import * as gameLogic from '../utils/gameLogic.js';

import Game from '../models/Game.js'
jest.mock('../models/Game.js'); 
jest.mock('../utils/gameLogic.js')
// Mocking the Game model

describe('startNewGame', () => {
    it('should create a new game and respond with 201 status', async () => {
      // Mock the Game model's save method
      Game.mockImplementation(() => {
        return {
          _id: '123',
          board: Array(9).fill(null),
          currentPlayer: 'X',
          status: 'ongoing',
          save: jest.fn().mockResolvedValue({
            _id: '123',
            board: Array(9).fill(null),
            currentPlayer: 'X',
            status: 'ongoing'
          })
        };
      });
  
      // Mock Express.js req and res objects
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      // Call the function with the mocked req and res
      await startNewGame(req, res);
  
      // Assertions
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: '123',
        board: Array(9).fill(null),
        currentPlayer: 'X',
        status: 'ongoing'
      }));
    });
  
    // Additional test to handle and assert error case...
  });
  


  describe('makeMove', () => {
    // Mock request and response objects
    let req, res;
  
    beforeEach(() => {
      req = { body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
    });
  
    it('should return 400 for an invalid position', async () => {
      req.body = { gameId: 'some-game-id', position: 9 };
      await makeMove(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid board position." });
    });
  
    it('should return 404 if game is not found or finished', async () => {
      Game.findById.mockResolvedValue(null);
      req.body = { gameId: 'some-game-id', position: 0 };
      await makeMove(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  
    it('should return 400 if position is already taken', async () => {
      Game.findById.mockResolvedValue({ board: ['X', null, null, null, null, null, null, null, null], status: 'ongoing' });
      req.body = { gameId: 'some-game-id', position: 0 };
      await makeMove(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle a valid move correctly', async () => {
        // Setup a mock game state
        const mockGame = {
          _id: 'some-game-id',
          board: Array(9).fill(null),
          currentPlayer: 'X',
          status: 'ongoing',
          save: jest.fn() // Mock the save function
        };
      
        // Mock findById to return the mock game state
        Game.findById.mockResolvedValue(mockGame);
      
        // Set the request body to simulate a player making a move
        req.body = { gameId: 'some-game-id', position: 0 };
      
        // Run the makeMove function
        await makeMove(req, res);
      
        // Assertions
        expect(mockGame.board[0]).toBe('X'); // Check if the board is updated correctly
        expect(mockGame.currentPlayer).toBe('O'); // Check if the player is switched
        expect(mockGame.save).toHaveBeenCalled(); // Ensure the game state is saved
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          _id: 'some-game-id',
          board: ['X', null, null, null, null, null, null, null, null],
          currentPlayer: 'O',
          status: 'ongoing'
        }));
      });
      
    
      //test for tie
      it('should handle a tie move correctly', async () => {
        // Mock game state just before a tie move
        const mockGame = {
          _id: 'some-game-id',
          board: ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null],
          currentPlayer: 'X',
          status: 'ongoing',
          save: jest.fn() // Mock the save function
        };
      
        // Mock findById to return the mock game state
        Game.findById.mockResolvedValue(mockGame);
      
        // Use jest.spyOn for the specific functions and mock implementations
        jest.spyOn(gameLogic, 'checkWin').mockImplementation(() => false);
        jest.spyOn(gameLogic, 'checkTie').mockImplementation(board => board.every(cell => cell !== null));
      
        // Set the request body to simulate the tie move
        req.body = { gameId: 'some-game-id', position: 8 };
      
        // Run the makeMove function
        await makeMove(req, res);
      
        // Assertions
        expect(mockGame.status).toBe('tied'); // Check if the game status is updated to 'tied'
        expect(mockGame.save).toHaveBeenCalled(); // Ensure the game state is saved
        expect(res.status).toHaveBeenCalledWith(200); // Check if the response status is 200
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
          status: 'tied'
        }));
      });
      
      
});  