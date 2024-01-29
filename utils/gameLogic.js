export const checkWin = (board) => {
    // Logic to determine if a player has won
    
    // below defining array of array in which all posible win conditions are define conditions 
    // like row wise, column wise and diagonaly 
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];
    
        for (let [a, b, c] of winConditions) {
            // I am checking the board[a] is not null and checking all three postion have same value then return true
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
    
        return false;
    
};