
const gameText = document.querySelector(".introduction-to-game");
const gameSection = document.querySelector(".game-section");
const whoseTurnInfo = document.getElementById("turn-info");
const boardContainer = document.querySelector(".game-board-container");
const beginGame = document.getElementById("start-game");
const continueGameContainer = document.querySelector(".continue-game-section");
const continueGame = document.getElementById("continue-game");
const restartGameContainer = document.querySelector(".restart-section");


beginGame.addEventListener('click', () => {
    
    gameStarts.startGame();

    gameSection.classList.remove('hidden');

    boardGame();
    
    gameText.replaceChildren();

    
});



const switchPlayer = (function() {
    
    function getSelectedPlayerOption() {
        let selectedPlayerOption = "";

        const selectedRadioOption = document.querySelector('input[name="radio-option-player"]:checked');
        
        if (selectedRadioOption) {
            selectedPlayerOption = selectedRadioOption.value;
            
        }
        return selectedPlayerOption;

    }
    
    return {
        getSelectedPlayerOption: getSelectedPlayerOption
    };


})();



const currentPlayer = (function() {

    function getCurrentPlayerName() {
        
        let currentPlayerName = "";
        let selectedPlayerOption = switchPlayer.getSelectedPlayerOption();
        
        if (selectedPlayerOption === "player-one") {
            currentPlayerName = "You";
        }
        else if (selectedPlayerOption === "player-two") {
            currentPlayerName = "Opponent";
        }

        return currentPlayerName;

    }

    return {
        getCurrentPlayerName: getCurrentPlayerName
    };


})();


const gameStarts = (function() {

    let gameStarted = false;
    let activePlayer = 0;
    let activePlayerName = "";
    
    return {
        startGame: function() {
            if (gameStarted) return;
            gameStarted = true;

            if (!activePlayerName) { /*this is so JS will NOT anymore look for the replaced/destroyed DOM because it's already stored and so already persists*/
                activePlayerName = currentPlayer.getCurrentPlayerName();
            }
            
            console.log("Active player name at startGame: ", activePlayerName);
           
            if (activePlayerName === "You") {
                whoseTurnInfo.textContent = "Your turn:";
            }
           
            else if (activePlayerName === "Opponent") {
                whoseTurnInfo.textContent = "Your Opponent's turn:";
            }

            activePlayer = 1;


        },
        endGame: function() {
            if (!gameStarted) return;
            gameStarted = false;

            activePlayer = 0;
            
            clearForAnotherRound();

        },
        
        isGameRunning: function() {
            return gameStarted;
        },

        getActivePlayer: function() {
            return activePlayer;
        },

        getActivePlayerName: function() {
            return activePlayerName;
        }


    };


})();



function boardGame() {  

    const rows = 3;
    const columns = 3;
    const totalSquares = rows * columns;
    const squareSizePercentage = 100 / rows;
    
    let markedSquares = [];
    let markedByPlayer = "";
    let activePlayer = gameStarts.getActivePlayer();
    let activePlayerName = gameStarts.getActivePlayerName();
    
    for (let i = 1; i <= totalSquares; i++) {
        const eachSquare = document.createElement("div");
        eachSquare.className = "board-square";
        eachSquare.style.flex = `0 0 ${squareSizePercentage}%`;
        eachSquare.style.aspectRatio = " 1 / 1";
        
        boardContainer.append(eachSquare);

        eachSquare.addEventListener('click', () => {
            
            if (!markedSquares.includes(i)) {
                markedByPlayer = i;
                markedSquares.push(markedByPlayer);

                if (activePlayer === 0) {
                    return;
                }
                else {

                    const display = rulesOfDisplay(activePlayer, activePlayerName);
                    display.displayText();    
                    const playerIndex = display.getPlayerIndex();
                    eachSquare.textContent = display.getMarker();

                    const gameIsOver = resultOfGame(playerIndex, markedByPlayer, markedSquares.length);

                    if (gameIsOver) {
                        activePlayer = 0;

                        if ((game.getStreak(playerIndex)) === 3) {
                            whoseTurnInfo.textContent = (activePlayerName === "You") ? "Your Opponent wins three in a row!😁" : "You win three in a row! Super!"
                            continueGameContainer.replaceChildren();
                            restartGameContainer.classList.remove("hidden");

                        }
                        return;   

                    }

                    whoseTurnInfo.textContent = display.getWhoseTurnText();
                    
                    activePlayer = (activePlayer === 1) ? 2 : 1;
                    console.log("Switch active player: ", activePlayer);
                    

                }

   
            }
      
        });
        
    }

}



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




function playGame(playerIndex, markedByPlayer) {

    game.playerMarks(playerIndex, markedByPlayer);
    let marks = game.getEachPlayer(playerIndex).squaresMarked;
    
    const winningSquaresCombo = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]

    ]
    const playerHasSquaresCombo = winningSquaresCombo.some(combination => combination.every(square => marks.includes(square)));

    return playerHasSquaresCombo;

}



function resultOfGame(playerIndex, markedByPlayer, allMarkedSquares) {
    
    let player = game.getEachPlayer(playerIndex).playerName;
    const playerHasSquaresCombo = playGame(playerIndex, markedByPlayer);

    if (playerHasSquaresCombo) {
        gameStarts.endGame();
        game.addWins(playerIndex);
        game.addStreak(playerIndex);

        continueGameContainer.classList.remove("hidden");

        console.log(`${player} wins!`);
        whoseTurnInfo.textContent = (player === "You") ? "You win!" : "Your Opponent wins!";

        return true;

    }
    else if (!playerHasSquaresCombo && allMarkedSquares === 9) {   
        whoseTurnInfo.textContent = "Round over! It's a tie!";
        game.tieStopsStreak();
        gameStarts.endGame();
        
        return true;

    }

    return false;

}


const rulesOfDisplay = (function(activePlayer, activePlayerName) {

    let playerIndex, marker, whoseTurnText;

    return {
        displayText: function() {
            if (activePlayer === 1 && activePlayerName === "You") {
                playerIndex = 0;
                marker = "X";
                whoseTurnText = "Your Opponent's turn:"

            }
            else if (activePlayer === 2 && activePlayerName === "You") {
                playerIndex = 1;
                marker = "O";
                whoseTurnText = "Your turn:";

            }
            else if (activePlayer === 1 && activePlayerName === "Opponent") {
                playerIndex = 1;
                marker = "X";
                whoseTurnText = "Your turn:";
            }
            else if (activePlayer === 2 && activePlayerName === "Opponent") {
                playerIndex = 0;
                marker = "O";
                whoseTurnText = "Your Opponent's turn:";

            }

        },
        getPlayerIndex: function() {
            return playerIndex;
        },
        getMarker: function() {
            return marker;
        },
        getWhoseTurnText: function() {
            return whoseTurnText;
        }

    }
    
});



function clearForAnotherRound() {
    const allPlayers = game.getAllPlayers();
    allPlayers.forEach(player => {
        player.squaresMarked = [];

        
    });
    
    boardContainer.replaceChildren();
    boardGame();
    
}


continueGame.addEventListener('click', () => {
    gameStarts.startGame();
    boardContainer.replaceChildren();
    boardGame();

})







