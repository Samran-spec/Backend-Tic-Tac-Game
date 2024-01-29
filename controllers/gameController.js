import  Game from '../models/Game.js'

export const startNewGame = async (req, res) => {
    try {
        const newGame = new Game(); //create a new instance/documet of game model in memory
        await newGame.save(); //save newly created instance into DB
        res.status(201).json(newGame); //return the object 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};