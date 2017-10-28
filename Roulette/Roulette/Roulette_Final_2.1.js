function DebugSettings() {
    this.isEnabled = true;
    this.SimulateInput = true;
    this.Verbose = true;
    this.Cycles = 1000;
    this.Errors = 0;
    this.Success = 0;
    this.Pass = 0;
}
var DEBUG = new DebugSettings();

const MAXPLAYERS = 6;

const RED = [9, 30, 7, 32, 5, 34, 3, 36, 1, 27, 25, 12, 19, 18, 21, 16, 23, 14];
const BLACK = [11, 20, 17, 22, 15, 24, 13, 10, 29, 8, 31, 6, 33, 4, 35, 2, 28, 26];
const COLUMN1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const COLUMN2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const COLUMN3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

const MAINMENUSTRING = "0. Exit\n" +
                        "1. Select single number\n" +
                        "2. Select Odd or Even\n" +
                        "3. Select Rouge/Noir (Red/Black)\n" +
                        "4. Select Manque/Passe (1-18,19-36)\n" +
                        "5. Select Dozen\n" +
                        "6. Select Column";

var submenuSelectionArray = [
    "Error 001, this should not happen, please report this to anyone but John :P ",
    "Choose a number between 1 and 36" + "\n" + "0 to exit",
    "1. Bet on Odd" + "\n" + "2. Bet on Even" + "\n" + "0 to exit",
    "1. Bet on Rouge/Red" + "\n" + "2. Bet on Noir/Black" + "\n" + "0 to exit",
    "1. Bet on Manque(Low) (1-18)" + "\n" + "2. Bet on Passe(High) (19-36)" + "\n" + "0 to exit",
    "1. Bet 1-12" + "\n" + "2. Bet 13-24" + "\n" + "3. Bet 25-36" + "\n" + "0 to exit",
    "1. Bet Column 1 - " + COLUMN1 + "\n" + "2. Column 2 - " + COLUMN2 + "\n" + "3. Bet Column 3 - " + COLUMN3 + "\n" + "0 to exit"];

var BetTypeEnum = {
    Basic: 0,
    Odd: 1,
    Even: 2,
    Red: 3,
    Black: 4,
    Manque: 5,
    Passe: 6,
    Low_Dozen: 7,
    Mid_Dozen: 8,
    High_Dozen: 9,
    Column_1: 10,
    Column_2: 11,
    Column_3: 12,
    Cancelled: 13,
};

var HighLowEnum = {
    Low: 1,
    High: 2,
};
var ColumnEnum = {
    One: 1,
    Two: 2,
    Three: 3,
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

var htmlTitle;
var htmlMessageOut;

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

    this.WinningNumber = -1;

    this.randomizeWinningNumber = function () {
        this.WinningNumber = (Math.floor(Math.random() * 37));
    }

    this.getWinnings = function (player) {
        switch (player.BetType) {
            case BetTypeEnum.Basic:
                if (this.isEqual(this.WinningNumber, player.BetNumber)) {
                    player.Winnings = player.BetAmount * 35;
                    return true;
                }
                break;
            case BetTypeEnum.Red:
                if (this.isRedBlack(this.WinningNumber) == RedBlackEnum.Red) {
                    player.Winnings = player.BetAmount * 1;
                    return true;
                }
                break;
            case BetTypeEnum.Black:
                if (this.isRedBlack(this.WinningNumber) == RedBlackEnum.Black) {
                    player.Winnings = player.BetAmount * 1;
                    return true;
                }
                break;
            case BetTypeEnum.Even:
                if (this.isEven(this.WinningNumber) == OddEvenEnum.Even) {
                    player.Winnings = player.BetAmount * 1;
                    return true;
                }
                break;
            case BetTypeEnum.Odd:
                if (!this.isEven(this.WinningNumber) == OddEvenEnum.Odd) {
                    player.Winnings = player.BetAmount * 1;
                    return true;
                }
                break;
            case BetTypeEnum.Passe:
                if (this.ishighLow(this.WinningNumber) == HighLowEnum.Low) {
                    player.Winnings = player.BetAmount * 1;
                    return true;
                }
                break;
            case BetTypeEnum.Manque:
                if (this.ishighLow(this.WinningNumber) == HighLowEnum.High) {
                    player.Winnings = player.BetAmount * 1;
                    return true;
                }
                break;
            case BetTypeEnum.Low_Dozen:
                if (this.isDozen(this.WinningNumber) == DozensEnum.Low) {
                    player.Winnings = player.BetAmount * 2;
                    return true;
                }
                break;
            case BetTypeEnum.Mid_Dozen:
                if (this.isDozen(this.WinningNumber) == DozensEnum.Mid) {
                    player.Winnings = player.BetAmount * 2;
                    return true;
                }
                break;
            case BetTypeEnum.High_Dozen:
                if (this.isDozen(this.WinningNumber) == DozensEnum.High) {
                    player.Winnings = player.BetAmount * 2;
                    return true;
                }
                break;
            case BetTypeEnum.Column_1:
                if (this.isColumn(this.WinningNumber) == ColumnEnum.One) {
                    player.Winnings = player.BetAmount * 2;
                    return true;
                }
                break;
            case BetTypeEnum.Column_2:
                if (this.isColumn(this.WinningNumber) == ColumnEnum.Two) {
                    player.Winnings = player.BetAmount * 2;
                    return true;
                }
                break;
            case BetTypeEnum.Column_3:
                if (this.isColumn(this.WinningNumber) == ColumnEnum.Three) {
                    player.Winnings = player.BetAmount * 2;
                    return true;
                }
                break;
            default:
                return false;
        }

    }

    /**
    *   Test if a value is in column
    *   @Param {Number} - Number to be tested
    *   @Return{ColumnEnum} - Result of the test
    */
    this.isColumn = function (value) {
        if (COLUMN1.includes(value))
            return ColumnEnum.One;
        if (COLUMN2.includes(value))
            return ColumnEnum.Two;
        if (COLUMN3.includes(value))
            return ColumnEnum.Three;
        return null;
    }

    /**
    *   Test if a value is Equal
    *   @Param {Number} - Number to be tested
    *   @Return{boolean} - Result of the test
    */
    this.isEqual = function (value, value2) {
        return (value == this.WinningNumber);
    }
    /**
    *   Test if a value is odd or even
    *   @Param {Number} - Number to be tested
    *   @Return{OddEvenEnum} - Result of the test
    */
    this.isEven = function (value) {
        if (value % 2)
            return OddEvenEnum.Odd;
        else
            return OddEvenEnum.Even;
    }


    /**
    *   Test if a value is Red/Black
    *   @Param {Number} - Number to be tested
    *   @Return{RedBlackEnum} - Result of the test
    */
    this.isRedBlack = function (value) {
        if (RED.includes(value)) {
            return RedBlackEnum.Red;
        }
        else if (BLACK.includes(value)) {
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
//    do {
        menuSelection = getNumericInput(message, 0, 6);
        if (menuSelection == 0) {
            player.BetType = BetTypeEnum.Cancelled;
            return -1;
        }
//    } while (menuSelection == undefined || menuSelection < 0 || menuSelection > 5)

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
            /********** CASE 5 - Dozens 1-12 | 13-24 | 25-36 **************/
        case 6:
            submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, Object.keys(ColumnEnum).length);
            if (submenuSelection == 0) { // If player selects exit from submenu
                player.BetType = BetTypeEnum.Cancelled; // set players bet to cancelled
            }
            else {
                if (submenuSelection == ColumnEnum.One) player.BetType = BetTypeEnum.Column_1;
                else if (submenuSelection == ColumnEnum.Two) player.BetType = BetTypeEnum.Column_2;
                else if (submenuSelection == ColumnEnum.Three) player.BetType = BetTypeEnum.Column_3;
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
    var input = getNumericInput("Player " + player.Id + "\nHow much do you want to bet (in £'s)?", 0, Number.MAX_SAFE_INTEGER);
    if (input == 0) player.BetType = BetTypeEnum.Cancelled;
    else player.BetAmount = input;
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

function runGame() {
//    if (navigator.userAgent.search("rv:11") != -1 || navigator.userAgent.search("MSIE") != -1)
//        document.write("Browser identified itserlf as " + navigator.userAgent + "<br>" + "Sorry, this application requires features unsupported by \"Microsoft Internet Explorer.\"")
//    else {
        var players = [];
        var roulette = new RouletteGame();
        roulette.randomizeWinningNumber();
        if (DEBUG.isEnabled) htmlTitle.innerHTML += (roulette.WinningNumber);
        var numberOfPlayers = getNumofPlayers();

        for (var i = 0; i < numberOfPlayers; i++) {
            players[i] = new PlayerObject();
            players[i].Id = i + 1;
            getPlayerBetChoice(players[i]);
            if (players[i].hasQuit() == false) {
                getBetAmount(players[i]);
            }
        }

        htmlMessageOut.innerHTML += "The winning number is " + roulette.WinningNumber + "<br><br>";
        for (var i = 0; i < numberOfPlayers; i++) {
            if (players[i].hasQuit())
                htmlMessageOut.innerHTML += "Player " + players[i].Id + " backed out. <br><br>";
            else if (roulette.getWinnings(players[i])) {
                var message = "We have a winner, Congratulations Player " + players[i].Id + " has won £" + players[i].Winnings + " ";

                if (players[i].BetType != BetTypeEnum.Basic) {
                    message += "with a bet on " + Object.keys(BetTypeEnum)[players[i].BetType] + "<br><br>";
                }
                else
                    message += "with number " + players[i].BetNumber + "<br><br>";

                htmlMessageOut.innerHTML += (message);
            }
            else
                htmlMessageOut.innerHTML += ("Sorry Player " + players[i].Id + ", your not a winner this time. <br>" + "You lost £" + players[i].BetAmount + "<br>" +
                            " Why not try and win it back. <br><br>");

            }
        }
    
//}
function testGameRandom() {
    var game = new RouletteGame();
    var nums = [];
    var cycles = {
        isEven: 0, isOdd: 0, isRed: 0, isBlack: 0, isHigh: 0, isLow: 0, isColumn1: 0, isColumn2: 0, isColumn3: 0, isDozen1: 0, isDozen2: 0, isDozen3: 0
    };

    htmlMessageOut.innerHTML += "Running random cycle test " + DEBUG.Cycles +" times.<br>";

    for (var i = 0; i < DEBUG.Cycles; i++) {
        game.randomizeWinningNumber();
        nums[i] = game.WinningNumber;
    }
    nums.sort();
    var numsObj = {};
    var current = null;
        var count = 0;
        for (var i = 0; i < nums.length; i++) {
            if (nums[i] != current) {
                if (count > 0) {
                    numsObj[current] = count;
                }
                current = nums[i];
                count = 1;
            } else {
                count++;
            }
        }
        for(var k in numsObj) {
            if (numsObj.hasOwnProperty(k))
                htmlMessageOut.innerHTML += "Number " + k + " Appeared " + numsObj[k] + " Times.<br>";
        }
    for (var i = 0; i < nums.length; i++) {
        if (game.isEven(nums[i]) == OddEvenEnum.Even) cycles.isEven += 1
        if (game.isEven(nums[i]) == OddEvenEnum.Odd) cycles.isOdd += 1
        if (game.isRedBlack(nums[i]) == RedBlackEnum.Red) cycles.isRed += 1
        if (game.isRedBlack(nums[i]) == RedBlackEnum.Black) cycles.isBlack += 1
        if (game.ishighLow(nums[i]) == HighLowEnum.High) cycles.isHigh += 1
        if (game.ishighLow(nums[i]) == HighLowEnum.Low) cycles.isLow += 1
        if (game.isColumn(nums[i]) == ColumnEnum.One) cycles.isColumn1 += 1
        if (game.isColumn(nums[i]) == ColumnEnum.Two) cycles.isColumn2 += 1
        if (game.isColumn(nums[i]) == ColumnEnum.Three) cycles.isColumn3 += 1
        if (game.isDozen(nums[i]) == DozensEnum.Low) cycles.isDozen1 += 1
        if (game.isDozen(nums[i]) == DozensEnum.Mid) cycles.isDozen2 += 1
        if (game.isDozen(nums[i]) == DozensEnum.High) cycles.isDozen3 += 1
    }

    htmlMessageOut.innerHTML += cycles.isEven + " Evens" + "<br>";
    htmlMessageOut.innerHTML += cycles.isOdd + " Odds" + "<br>";
    htmlMessageOut.innerHTML += cycles.isRed + " Reds" + "<br>";
    htmlMessageOut.innerHTML += cycles.isBlack + " Blacks" + "<br>";
    htmlMessageOut.innerHTML += cycles.isHigh + " Highs" + "<br>";
    htmlMessageOut.innerHTML += cycles.isLow + " Lows" + "<br>";
    htmlMessageOut.innerHTML += cycles.isColumn1 + " Column 1s" + "<br>";
    htmlMessageOut.innerHTML += cycles.isColumn2 + " Column 2s" + "<br>";
    htmlMessageOut.innerHTML += cycles.isColumn3 + " Column 3s" + "<br>";
    htmlMessageOut.innerHTML += cycles.isDozen1 + " Dozen 1s" + "<br>";
    htmlMessageOut.innerHTML += cycles.isDozen2 + " Dozen 2s" + "<br>";
    htmlMessageOut.innerHTML += cycles.isDozen3 + " Dozen 3s" + "<br>";
}

/***** Main Application  */

htmlTitle = document.getElementById('title');
htmlMessageOut = document.getElementById('messageOut');
window.onload = function () {
    if (DEBUG.isEnabled == false) runGame();


    /***** End Application */


    /*****  UNIT TESTS    */
    if (DEBUG.isEnabled) testGameRandom();
    /*******************/
}