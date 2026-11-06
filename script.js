
const gameText = document.querySelector(".introduction-to-game");
const gameSection = document.querySelector(".game-section");
const whoseTurnInfo = document.getElementById("turn-info");
const boardContainer = document.querySelector(".game-board-container");
const startGame = document.getElementById("start-game");
const continueGameContainer = document.querySelector(".continue-game-section");
const continueGame = document.getElementById("continue-game");



startGame.addEventListener('click', () => {
    
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
                whoseTurnInfo.textContent = "Player 1 (X)'s turn (You):";
            }
           
            else if (activePlayerName === "Opponent") {
                whoseTurnInfo.textContent = "Player 1 (X)'s turn (your Opponent):";
            }

            activePlayer = 1;

            /*boardGame();*/


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
    console.log("Active player name boardGame: ", activePlayerName);
    /*console.log("Active player at boardGame: ", activePlayer);*/
    
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

                    let playerIndex, marker, whoseTurnText;

                    if (activePlayer === 1 && activePlayerName === "You") {
                        playerIndex = 0;
                        marker = "X";
                        whoseTurnText = "Player 2 (O)'s turn (your Opponent):"

                    }
                    else if (activePlayer === 2 && activePlayerName === "You") {
                        playerIndex = 1;
                        marker = "O";
                        whoseTurnText = "Player 1 (X)'s turn (You):";

                    }
                    else if (activePlayer === 1 && activePlayerName === "Opponent") {
                        playerIndex = 1;
                        marker = "X";
                        whoseTurnText = "Player 2 (O)'s turn (You)";
                    }
                    else if (activePlayer === 2 && activePlayerName === "Opponent") {
                        playerIndex = 0;
                        marker = "O";
                        whoseTurnText = "Player 1 (X)'s turn (Your Opponent)";

                    }

                    eachSquare.textContent = marker;

                    const gameIsOver = resultOfGame(playerIndex, markedByPlayer, markedSquares.length);

                    if (gameIsOver) {
                        activePlayer = 0;
                        return;

                    }

                    whoseTurnInfo.textContent = whoseTurnText;
                    
                    activePlayer = (activePlayer === 1) ? 2 : 1;
                    console.log("Switch active player: ", activePlayer);
                    

                }

   
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
    console.log("Active player at continueGame: ", gameStarts.getActivePlayer());
    console.log("Active player name at continueGame: ", gameStarts.getActivePlayerName());
    
    boardContainer.replaceChildren();
    boardGame();

})







