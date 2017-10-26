function DebugSettings() {
    this.isEnabled = true;
    this.SimulateInput = true;
    this.Cycles = 10;
    this.Errors = 0;
    this.Success = 0;
    this.Pass = 0;
}
var DEBUG = new DebugSettings();

const MAXPLAYERS = 6;

const MAINMENUSTRING = "0. Exit\n" +
                        "1. Select single number\n" +
                        "2. Select Odd or Even\n" +
                        "3. Select Rouge/Noir (Red/Black)\n" +
                        "4. Select Manque/Passe (1-18,19-36)\n" +
                        "5. Select Dozen bet";

var submenuSelectionArray = [
    "Error 001, this should not happen, please report this to anyone but John :P ",
    "Choose a number between 1 and 36" + "/n" + "0 to exit",
    "1. Bet on Odd" + "\n" + "2. Bet on Even" + "/n" + "0 to exit",
    "1. Bet on Rouge/Red" + "\n" + "2. Bet on Noir/Black" + "/n" + "0 to exit",
    "1. Bet on Manque(Low) (1-18)" + "\n" + "2. Bet on Passe(High) (19-36)" + "/n" + "0 to exit",
    "1. Bet 1-12" + "\n" + "2. Bet 13-24" + "\n" + "3. Bet 25-36" + "/n" + "0 to exit"];

var BetTypeEnum = {
    Basic: 0,
    Odd: 1,
    Even: 2,
    Red: 3,
    Black: 4,
    Manque: 5,
    Passe: 6,
    Dozen12: 7,
    Dozen24: 8,
    Dozen36: 9,
    Cancelled: 10,
};

var HighLowEnum = {
    Low: 1,
    High: 2,
};

var RedBlackEnum = {
    Red: 1,
    Black: 2,
};

var DozensEnum = {
    Low: 1,
    Mid: 2,
    High: 3,
};

var OddEvenEnum = {
    Odd: 1,
    Even: 2,
};

function PlayerObject() {
    this.Id = -1;
    this.BetType = BetTypeEnum.Cancelled;
    this.BetNumber = -1;
    this.BetAmount = 0;
    this.Winnings = 0;
    // this.RoundsWon
    // this.TotalWon
    // this.TotalLoss
    this.hasQuit = function () { return this.BetType == BetTypeEnum.Cancelled; }
}

function RouletteGame() {
    //individual = 35:1  Zero = 35:1
    //Dozen = 2:1
    const red = [9, 30, 7, 32, 5, 34, 3, 36, 1, 27, 25, 12, 19, 18, 21, 16, 23, 14];
    const black = [11, 20, 17, 22, 15, 24, 13, 10, 29, 8, 31, 6, 33, 4, 35, 2, 28, 26];

//    this.HouseBalance;
    this.WinningNumber = -1;

    this.randomizeWinningNumber = function () {
        this.WinningNumber = 36;//(Math.floor(Math.random() * 37));
    }

    this.getWinnings = function (player) {
        switch (player.BetType) {
            case BetTypeEnum.Basic:
                if (this.isEqual(player.BetNumber))
                    player.Winnings = player.BetAmount * 35;
                break;
            case BetTypeEnum.Red:
                if (this.isRedBlack(player.BetNumber) == RedBlackEnum.Red &&
                    this.isRedBlack(this.WinningNumber) == RedBlackEnum.Red)
                    player.Winnings = player.BetAmount * 1;
                break;
            case BetTypeEnum.Black:
                if (this.isRedBlack(player.BetNumber) == RedBlackEnum.Black &&
                    this.isRedBlack(this.WinningNumber) == RedBlackEnum.Black)
                    player.Winnings = player.BetAmount * 1;
                break;
            case BetTypeEnum.Even:
                if (this.isEven(player.BetNumber) == this.isEven(this.WinningNumber))
                    player.Winnings = player.BetAmount * 1;
                break;
            case BetTypeEnum.Odd:
                if (this.isEven(player.BetNumber) == this.isEven(this.WinningNumber))
                    player.Winnings = player.BetAmount * 1;
                break;
            case BetTypeEnum.Passe:
                if (this.ishighLow(player.BetNumber) == this.ishighLow(this.WinningNumber))
                    player.Winnings = player.BetAmount * 1;
                break;
            case BetTypeEnum.Manque:
                if (this.ishighLow(player.BetNumber) == this.ishighLow(this.WinningNumber))
                    player.Winnings = player.BetAmount * 1;
                break;
            case BetTypeEnum.Dozen12:
                if (this.isDozen(this.WinningNumber))
                    player.Winnings = player.BetAmount * 2;
                break;
            case BetTypeEnum.Dozen24:
                if (this.isDozen(this.WinningNumber))
                    player.Winnings = player.BetAmount * 2;
                break;
            case BetTypeEnum.Dozen36:
                if  (this.isDozen(this.WinningNumber))
                    player.Winnings = player.BetAmount * 2;
                document.write("Congratulations we have a winner, Player " + player.Id + " has won £" + player.Winnings + " with number " + player.BetNumber +
                    " as a " + Object.keys[DozensEnum](this.isDozen(number)));
                break;
        }

    }

    /**
    *   Test if a value is Equal
    *   @Param {Number} - Number to be tested
    *   @Return{boolean} - Result of the test
    */
    this.isEqual = function (value) {
        return (value == this.WinningNumber);
    }
    /**
    *   Test if a value is odd or even
    *   @Param {Number} - Number to be tested
    *   @Return{OddEvenEnum} - Result of the test
    */
    this.isEven = function (value) {
        if (value % 2)
            return OddEvenEnum.Even;
        else
            return OddEvenEnum.Odd;
    }


    /**
    *   Test if a value is Red/Black
    *   @Param {Number} - Number to be tested
    *   @Return{Number} - Result of the test
    */
    this.isRedBlack = function (value) {
        if (red.includes(value)) {
            return RedBlackEnum.Red;
        }
        else if (black.includes(value)) {
            return RedBlackEnum.Black;
        }
    }

    /**
    *   Test if a value is within lower dozen, middle, or high
    *   @Param {Number} - Number to be tested
    *   @Return{DozensEnum} - Result of the test
    */
    this.isDozen = function (number) {
        if (number > 0 && number <= 12) {
            return DozensEnum.Low;
        }
        else if (number > 12 && number <= 24) {
            return DozensEnum.Mid
        }
        else if (number > 12 && number <= 36) {
            return DozensEnum.High;
        }
    }

    /**
    *   Test if a value is high or low(Manque/Passe)
    *   @Param {Number} - Number to be tested
    *   @Return{HighLowEnum} - Result of the test
    */
    this.ishighLow = function (value) {
        if (value > 0 && value <= 18) {
            return HighLowEnum.Low;
        }
        else if (value > 18) {
            return HighLowEnum.High;
        }
    }
}


/**
*   Main bet selection menu for a player, this will ask the player to enter there type of bet
*   @param {Player} player - Current player selecting a type of bet
*/
function getPlayerBetChoice(player) {//player) {
    var menuSelection;
    var message = "Enter a bet selection for Player " + player.Id + "\n" + MAINMENUSTRING;
    do {
        menuSelection = getNumericInput(message, 0, 5);
        if (menuSelection == 0) {
            player.BetType = BetTypeEnum.Cancelled;
            return -1;
        }
    } while (menuSelection == undefined || menuSelection < 0 || menuSelection > 5)

    var submenuSelection = -1;
    switch (menuSelection) {
        /********** CASE 0 - User selected cancel bet **************/
        case 0: player.BetType = BetTypeEnum.Cancelled;
            break; // user exit
            /********** CASE 1 - All numbers 1 - 36 **************/
        case 1:
            submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, 36); // ask player for bet type
            if (submenuSelection == 0) { // If player selects exit from submenu
                player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            }
            else {
                player.BetType = BetTypeEnum.Basic;     // set players bet type to basic and
                player.BetNumber = submenuSelection;    // store the number
            }
            break;
            /********** CASE 2 - Odds and Evens **************/
        case 2:
            submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, 2);
            if (submenuSelection == 0) { // If player selects exit from submenu
                player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            }
            else {
                if (submenuSelection == OddEvenEnum.Odd) player.BetType = BetTypeEnum.Odd;
                else if (submenuSelection == OddEvenEnum.Even) player.BetType = BetTypeEnum.Even;
            }
            break;
            /********** CASE 3 - Red or Black **************/
        case 3:
            submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, 2);
            if (submenuSelection == 0) { // If player selects exit from submenu
                player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            }
            else {
                if (submenuSelection == RedBlackEnum.Red) player.BetType = BetTypeEnum.Red;
                else if (submenuSelection == RedBlackEnum.Black) player.BetType = BetTypeEnum.Black;
            }
            break;
            /********** CASE 4 - Manque or Passe **************/
        case 4:
            submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, 2);
            if (submenuSelection == 0) { // If player selects exit from submenu
                player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            }
            else {
                if (submenuSelection == HighLowEnum.Low) player.BetType = BetTypeEnum.Manque;
                else if (submenuSelection == HighLowEnum.High) player.BetType = BetTypeEnum.Passe;
            }
            break;
            /********** CASE 5 - Dozens 1-12 | 13-24 | 25-36 **************/
        case 5:
            submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, 3);
            if (submenuSelection == 0) { // If player selects exit from submenu
                player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            }
            else {
                if (submenuSelection == DozensEnum.Low) player.BetType = BetTypeEnum.Dozen12;
                else if (submenuSelection == DozensEnum.Mid) player.BetType = BetTypeEnum.Dozen24;
                else if (submenuSelection == DozensEnum.High) player.BetType = BetTypeEnum.Dozen36;
            }
            break;
        default:
            player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            break;
    }
}
/*
*   Prompt the user for an amount to bet
*   @Param {Player} player - Current player that is placing the bet 
*   @Todo: Add test for "£" signs
*/
function getBetAmount(player) {
    player.Winnings += getNumericInput("Player " + player.Id + "\nHow much do you want to bet (in £'s)?", 0, Number.MAX_SAFE_INTEGER);
}
/*
*   Prompt the user for the number of players, Maximum is defined as a constant.
*   @return {Number} Number of players.
*/
function getNumofPlayers() {
    return getNumericInput("Enter the number of players who wish to play (between 1-" + MAXPLAYERS + ")", 0, MAXPLAYERS);
}

/**
*   Create a prompt window with a message and loop until a user inputs a valid number
*   @Param {String} message - Message to be displayed in the prompt window
*   @return {Number} Validated number
*/
function getNumericInput(message, lowerBounds, upperBounds) {
    var input;
    do {
        input = Number(window.prompt(message));
    } while (isNumeric(input) == false || input < lowerBounds || input > upperBounds)
    return input;
}

/**
*   Test if a value is a valid number
*   @Param {object} value - Value that is to be tested
*   @Return {boolean} True if the value is is a number otherwise false
*/
function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/***** Main Application  */

var players = [];
var roulette = new RouletteGame();
roulette.randomizeWinningNumber();

var numberOfPlayers = getNumofPlayers();

for (var i = 0; i < numberOfPlayers; i++) {
    players[i] = new PlayerObject();
    players[i].Id = i + 1;
    getPlayerBetChoice(players[i]);
    getBetAmount(players[i]);
    if(players[i].hasQuit == false)
        roulette.getWinnings(players[i].BetType, players[i].BetNumber, players[i].BetAmount)
}

/***** End Application */


/*****  UNIT TESTS    */

/*
*   Testing Max Players
*
*
if (DEBUG.isEnabled){
function testMaxPlayers() {
    for (var i = 0; i < DEBUG.Cycles; i++) {
        var test = getNumofPlayers
    }
}

}
/*******************/



/*
function getActualBet(selectionNum, playerNum) {
    selectedBet = 0;
    if (selectionNum == 1) {
        while (selectedBet < 1 || selectedBet > 36) {
            selectedBet = getNumericInput("Player " + playerNum + "\nChoose a number between 1 and 36");
        }
    }
    else if (selectionNum == 2) {
        while (selectedBet != 1 && selectedBet != 2) {
            selectedBet = getNumericInput("Player " + playerNum + "\n1. Bet on Odd\n2. Bet on Even");
        }
    }
    else if (selectionNum == 3) {
        while (selectedBet != 1 && selectedBet != 2) {
            selectedBet = getNumericInput("Player " + playerNum + "\n1. Bet on Rouge/Red\n2. Bet on Noir/Black");
        }
    }
    else if (selectionNum == 4) {
        while (selectedBet != 1 && selectedBet != 2) {
            selectedBet = getNumericInput("Player " + playerNum + "\n1. Bet on Manque (1-18) \n2. Bet on Passe (19-36)");
        }
    }
    else {
        while (selectedBet != 1 && selectedBet != 2 && selectedBet != 3) {
            selectedBet = getNumericInput("Player " + playerNum + "\n1. Bet 1-12\n2. Bet 13-24\n3. Bet 25-36");
        }
    }

    return selectedBet;

}
numPlayers = getNumofPlayers();

for (count = 0; count < numPlayers; count++) {
    selectArray[count] = getUserSelection(count + 1);
    if (selectArray[count] == 0) break;
    betArray[count] = getActualBet(selectArray[count], count + 1);
    betAmount[count] = getBetAmount(count + 1);

}

winningNumber = random();
document.write("The winning number is " + winningNumber + "<br/>");

for (count = 0; count < numPlayers; count++) {
    if (selectArray[count] == 1) {
        var payout = 0;
        if (winningNumber == betArray[count]) {
            document.write("Player " + (count + 1) + "<br/>You chose the right number!<br/>");
            payout = 36 * betAmount[count];
            document.write("You have won £", payout);
        }
        else {
            document.write("Sorry, Player " + (count + 1) + "<br/>You are a loser!<br/>");
        }
    }
    else if (selectArray[count] == 2) {
        if (isEven(winningNumber) == betArray[count]) {
            document.write("Player " + (count + 1) + "<br/>You chose the right selection!<br>");
            payout = 2 * betAmount[count];
            document.write("You have won £", payout);
        }
        else {
            document.write("Sorry, Player " + (count + 1) + "<br/>You are a loser!<br/>");
        }

    }
    else if (selectArray[count] == 3) {
        if (redBlack(winningNumber) == betArray[count]) {
            document.write("Player " + (count + 1) + "<br/>You chose the right selection!<br>");
            payout = 2 * betAmount[count];
            document.write("You have won £", payout);
        }
        else {
            document.write("Sorry, Player " + (count + 1) + "<br/>You are a loser!<br/>");
        }

    }
    else if (selectArray[count] == 4) {
        if (highLow(winningNumber) == betArray[count]) {
            document.write("Player " + (count + 1) + "<br/>You chose the right selection!<br>");
            payout = 2 * betAmount[count];
            document.write("You have won £", payout);
        }
        else {
            document.write("Sorry, Player " + (count + 1) + "<br/>You are a loser!<br/>");
        }

    }
    else if (selectArray[count] == 5) {
        if (checkDozen(winningNumber) == betArray[count]) {
            document.write("Player " + (count + 1) + "<br/>You chose the right selection!<br>");
            payout = 3 * betAmount[count];
            document.write("You have won £", payout);
        }
        else {
            document.write("Sorry, Player " + (count + 1) + "<br/>You are a loser!<br/>");
        }

    }


}

*/