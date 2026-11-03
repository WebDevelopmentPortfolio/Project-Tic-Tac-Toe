
const gameText = document.querySelector(".introduction-to-game");
const boardContainer = document.querySelector(".game-board-container");
const startGame = document.getElementById("start-game");



startGame.addEventListener('click', () => {
    gameText.replaceChildren();
    boardContainer.classList.remove('hidden');


});


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
            playerName: "You",
            squaresMarked:  [...marksByPlayer],  
            wins: 0,
            winStreak: 0,

        },
        {
            playerName: "Opponent",
            squaresMarked:  [...marksByPlayer],
            wins: 0,
            winStreak: 0
            
        }
        
    ];

    return {
        playerMarks: function(index, markedByPlayer) {
            players[index].squaresMarked.push(markedByPlayer);
        },

        addWins: function(index) {
            return players[index].wins++;

        },

        addStreak: function(winnerIndex) {
            players[winnerIndex].winStreak++;

            const loserIndex = winnerIndex === 0 ? 1: 0;
            players[loserIndex].winStreak = 0;

        },

        numberOfWins: function(index) {
            return players[index].wins;

        },

        tieStopsStreak: function() {
            players[0].winStreak = 0;
            players[1].winStreak = 0;
        },

        getStreak: function(index) {
            return players[index].winStreak;
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
    let player = game.getEachPlayer(playerIndex).playerName;
    
    rulesOfTheGame(marks, playerIndex, player, allMarkedSquares);

    if (game.getStreak(playerIndex) === 3) {
        console.log(`${player} overall wins!`); 
        clearForAnotherRound();

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
        game.addStreak(playerIndex);
        
        console.log(`${player} wins!`);
        console.log(`${player} wins: `, game.numberOfWins(playerIndex));
        console.log(`${player} streak: `, game.getStreak(playerIndex));
        clearForAnotherRound();

    }
    if (!playerHasAllNumbers && allMarkedSquares === 9) {
        console.log("Round over! It's a tie!");
        game.tieStopsStreak();
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



