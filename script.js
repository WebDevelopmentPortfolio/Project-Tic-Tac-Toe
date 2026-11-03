

const boardContainer = document.querySelector(".game-board-container");


function boardGame() {

    const rows = 3;
    const columns = 3;
    const totalSquares = rows * columns;
    const squareSizePercentage = 100 / rows;
    
    let markedSquares = [];
    let markedByPlayer = "";
    let currentPlayer = 1;
    
    for (let i = 1; i <= totalSquares; i++) {
        const eachSquare = document.createElement("div");
        eachSquare.className = "board-square";
        eachSquare.style.flex = `0 0 ${squareSizePercentage}%`;
        eachSquare.style.aspectRatio = " 1 / 1";
        
        boardContainer.append(eachSquare);

        eachSquare.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (!markedSquares.includes(i)) {
                markedByPlayer = i;
                markedSquares.push(markedByPlayer);
                    
                if (currentPlayer === 1) {
                    playGame(0, markedByPlayer, markedSquares.length);
                    eachSquare.textContent = "X";
                        
                }
                else {
                    playGame(1, markedByPlayer, markedSquares.length);
                    eachSquare.textContent = "O";
                            
                }

                currentPlayer = (currentPlayer === 1) ? 2 : 1;

            }
      
        });
        
    }

}


//IIFE
const game = (function() {
    let marksByPlayer = [];

    const players =  [
        {
            playerNumber: 1,
            squaresMarked:  [...marksByPlayer],
            wins: 0

        },
        {
            playerNumber: 2,
            squaresMarked:  [...marksByPlayer],
            wins: 0
        }
        
    ];

    return {
        addWins: function(index) {
            return players[index].wins++;
        },

        numberOfWins: function(index) {
            return players[index].wins;

        },

        playerMarks: function(index, markedByPlayer) {
            players[index].squaresMarked.push(markedByPlayer);
        },

        getEachPlayer: function(index) {
            return players[index];
        },
        
        getAllPlayers: function() {
            return players;
        }


    };


})();



function playGame(playerIndex, markedByPlayer, allMarkedSquares) {
    
    game.playerMarks(playerIndex, markedByPlayer);
    let marks = game.getEachPlayer(playerIndex).squaresMarked;
    let player = game.getEachPlayer(playerIndex).playerNumber;
    
    rulesOfTheGame(marks, playerIndex, player, allMarkedSquares);

    if (game.numberOfWins(playerIndex) === 3) {
        console.log(`${player} wins!`); 
        console.log("Want to play another round?");

    }
    

}


function rulesOfTheGame(marks, playerIndex, player, allMarkedSquares) {
    const winningCombinations = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]

    ]
    const playerHasAllNumbers = winningCombinations.some(combination => combination.every(number => marks.includes(number)));
    
    if (playerHasAllNumbers) {
        game.addWins(playerIndex);
        console.log(`${player} wins!`);
        console.log(`${player} wins: `, game.numberOfWins(playerIndex));
        clearForAnotherRound();

    }
    if (!playerHasAllNumbers && allMarkedSquares === 9) {
        console.log("Round over! It's a tie!");
        clearForAnotherRound();
        
    }


}


function clearForAnotherRound() {
    const allPlayers = game.getAllPlayers();
    allPlayers.forEach(player => {
        player.squaresMarked = [];
        
    });
    
    boardContainer.replaceChildren();
    boardGame();
    
}


boardGame();



