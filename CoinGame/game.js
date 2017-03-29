   var roundsCounter = 0;

        function enablePlayer(playerString) {
            var readyBox = document.getElementById(playerString + 'Ready');
            readyBox.value = (window.wager <= window[playerString + 'Balance']) ? "Ready" : "Not Ready";
            readyBox.disabled = (!window.wager) || (window.wager > window[playerString + 'Balance']);
            var balanceBox = document.getElementById(playerString + 'Balance');
            balanceBox.disabled = false;
            checkGameReady();
        }

        function checkGameReady() {
            var gameReady = true;
            var players = ['player1', 'player2'];
            for (var i = 0, len = players.length, text = ""; i < len; i++) {
                gameReady = gameReady && !(document.getElementById(players[i] + 'Ready').disabled);

            }
            document.getElementById('PlayGame').disabled = !gameReady;
        }


        function disablePlayer(playerString) {
            var readyBox = document.getElementById(playerString + 'Ready');
            readyBox.value = "Not Ready";
            readyBox.disabled = true;
            var balanceBox = document.getElementById(playerString + 'Balance');
            balanceBox.disabled = true;
            checkGameReady();
        }

        function StoreWager() {
            window.wager = document.getElementById('wager').value;
        }

        function playGame() {
            var acct1 = 'player1';
            var acct2 = 'player2';

            document.getElementById('PlayGame').disabled = true;
            StoreWager();
            var choiceOptions = document.getElementsByName('userChoice');
            var userChoice = '';
            for (var i = 0, length = choiceOptions.length; i < length; i++) {
                if (choiceOptions[i].checked) {
                    // do whatever you want with the checked radio
                    userChoice = choiceOptions[i].value;

                    // only one radio can be logically checked, don't check the rest
                    break;
                }
            }
            if (!userChoice) {
                alert("Please pick rock, paper, or scissors first!");
                checkGameReady();
                return;
            }

            roundsCounter += 1;
            disablePlayer(acct1);
            disablePlayer(acct2);

            var computerChoice = getRandomRPS();

            var sResult = "\nRound " + roundsCounter + ": " + userChoice + "[" + "player1" + "]" + " vs " + computerChoice + "[" + "Computer" + "]:\t";
            var winner = compare(userChoice, computerChoice);
            if (winner == 1) {
                sResult += "Player 1 wins!";
                sResult += "\n" + PayWinner(acct2, acct1, window.wager);
            } else if (winner == 2) {
                sResult += "Player 2 wins!";
                sResult += "\n" + PayWinner(acct1, acct2, window.wager);
            } else {
                sResult += "The result is a tie!";
                enablePlayer(acct1);
                enablePlayer(acct2);
            }
            PrintOutput(sResult + "\n");
            checkGameReady();
        }

        function getRandomRPS() {
            var choice = Math.random();
            if (choice < 0.34) {
                choice = "rock";
            } else if (choice <= 0.67) {
                choice = "paper";
            } else {
                choice = "scissors";
            }
            return choice;
        }

        function compare(player1, player2) {
            if (player1 === player2) {
                return 0;
            }
            if (player1 === "rock") {
                if (player2 === "scissors") {
                    return 1;
                } else {
                    return 2;
                }
            }
            if (player1 === "paper") {
                if (player2 === "rock") {
                    return 1;
                } else {
                    return 2;
                }
            }
            if (player1 === "scissors") {
                if (player2 === "rock") {
                    return 2;
                } else {
                    return 1;
                }
            }
        }

        function PrintOutput(txt) {
            document.getElementById('results').value = txt + "\n" + document.getElementById('results').value;
        }