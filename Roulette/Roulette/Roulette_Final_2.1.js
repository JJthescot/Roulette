function DebugSettings() {
    this.isEnabled = true;
    this.SimulateInput = true;
    this.SimulationPlayers = 6;
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

/** Exception object to be thrown on errors
*   @Param{ExceptionType} Type - Type of exception thrown
*   @Param{String} Message - Message from sender
*/
function Exception(Type, Message) {
    this.type = Type;
    this.message = Message;
}
//  Exception type enumerator
var ExceptionType = {
    NotNumeric: 0,
    BetTypeMismatch: 1,
    QuitPlayerPlaying: 2,
    UndefinedBetType: 3,
    Undefined: 4,

};

var submenuSelectionArray = [
    "Error 001, this should not happen, please report this to anyone but John :P ",
    "Choose a number between 1 and 36" + "\n" + "0 to exit",
    "1. Bet on Odd" + "\n" + "2. Bet on Even" + "\n" + "0 to exit",
    "1. Bet on Rouge/Red" + "\n" + "2. Bet on Noir/Black" + "\n" + "0 to exit",
    "1. Bet on Manque(Low) (1-18)" + "\n" + "2. Bet on Passe(High) (19-36)" + "\n" + "0 to exit",
    "1. Bet 1-12" + "\n" + "2. Bet 13-24" + "\n" + "3. Bet 25-36" + "\n" + "0 to exit",
    "1. Bet Column 1 - " + COLUMN1 + "\n" + "2. Column 2 - " + COLUMN2 + "\n" + "3. Bet Column 3 - " + COLUMN3 + "\n" + "0 to exit"];

// Bet type enumerator
var BetTypeEnum = {
    Cancelled: 0,
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
    Basic: 13,
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

/*  Base player object for storing all individual player data
*   @Todo:  Implement multiple bets per player
*           Store multiple round stats
*/
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
    this.processWinnings = function () { console.log("Proxy Handled");}
}
var players = [];
var roulette = new RouletteGame();



/*  Main roulette system controls the flow of the roulette system
*   @Todo - Implement event trigger
*/
function RouletteGame() {
    this.WinningNumber = -1;
    this.randomizeWinningNumber = function () {
        this.WinningNumber = parseInt(Math.floor(Math.random() * 37));
    };
//    this.randomizeWinningNumber = function () {
//        this.WinningNumber = parseInt(Math.floor(Math.random() * 37));
//    };

    /* Take current player object and calculates if the player won then stores the players winnings
    *   @Todo:  Implement '0' win
    *           Re-write to a better implementation
    *   @return{Boolean} returns true if player is a winner
    */
    this.isWinner = function(player) {
        switch (player.BetType) {
            case BetTypeEnum.Basic:
                if (this.isEqual(this.WinningNumber, player.BetNumber)) {
                    
                    //                    player.Winnings = (player.BetAmount * 35) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Red:
                if (this.isRedBlack(this.WinningNumber) == RedBlackEnum.Red) {
//                    player.Winnings = (player.BetAmount * 1) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Black:
                if (this.isRedBlack(this.WinningNumber) == RedBlackEnum.Black) {
//                    player.Winnings = (player.BetAmount * 1) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Even:
                if (this.isEven(this.WinningNumber) == OddEvenEnum.Even) {
//                    player.Winnings = (player.BetAmount * 1) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Odd:
                if (!this.isEven(this.WinningNumber) == OddEvenEnum.Odd) {
//                    player.Winnings = (player.BetAmount * 1) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Passe:
                if (this.ishighLow(this.WinningNumber) == HighLowEnum.Low) {
//                    player.Winnings = (player.BetAmount * 1) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Manque:
                if (this.ishighLow(this.WinningNumber) == HighLowEnum.High) {
//                    player.Winnings = (player.BetAmount * 1) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Low_Dozen:
                if (this.isDozen(this.WinningNumber) == DozensEnum.Low) {
//                    player.Winnings = (player.BetAmount * 2) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Mid_Dozen:
                if (this.isDozen(this.WinningNumber) == DozensEnum.Mid) {
//                    player.Winnings = (player.BetAmount * 2) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.High_Dozen:
                if (this.isDozen(this.WinningNumber) == DozensEnum.High) {
//                    player.Winnings = (player.BetAmount * 2) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Column_1:
                if (this.isColumn(this.WinningNumber) == ColumnEnum.One) {
//                    player.Winnings = (player.BetAmount * 2) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Column_2:
                if (this.isColumn(this.WinningNumber) == ColumnEnum.Two) {
//                    player.Winnings = (player.BetAmount * 2) + player.BetAmount;
                    return true;
                }
                break;
            case BetTypeEnum.Column_3:
                if (this.isColumn(this.WinningNumber) == ColumnEnum.Three) {
//                    player.Winnings = (player.BetAmount * 2) + player.BetAmount;
                    return true;
                }
                break;
            default:
                return false;
        }

    };

    /**
    *   Test if a value is in column
    *   @Param {Number} - Number to be tested
    *   @Return{ColumnEnum} - Result of the test
    *   @Throws{Exception} BetTypeMismatch Exception 
    */
    this.isColumn = function (value) {
        if (contains(COLUMN1,value))
            return ColumnEnum.One;
        if (contains(COLUMN2,value))
            return ColumnEnum.Two;
        if (contains(COLUMN3,value))
            return ColumnEnum.Three;
        else throw new Exception(ExceptionType.BetTypeMismatch, value.toString() + " not a column.");
    };
    /**
    *   Test if a value is Equal
    *   @Param {Number} - Number to be tested
    *   @Return{boolean} - Result of the test
    *   @Throws{Exception} BetTypeMismatch Exception 
    */
    this.isEqual = function (value, value2) {
        return (value === this.WinningNumber);
    };
    /**
    *   Test if a value is odd or even
    *   @Param {Number} - Number to be tested
    *   @Return{OddEvenEnum} - Result of the test
    *   @Throws{Exception} BetTypeMismatch Exception 
    */
    this.isEven = function (value) {
        if (isNumeric(value)) {
            if (value % 2)
                return OddEvenEnum.Odd;
            else
                return OddEvenEnum.Even;
        }
    },
    /**
    *   Test if a value is Red/Black
    *   @Param {Number} - Number to be tested
    *   @Return{RedBlackEnum} - Result of the test
    *   @Throws{Exception} BetTypeMismatch Exception 
    */
    this.isRedBlack = function (value) {
        if (contains(RED,value)) {
            return RedBlackEnum.Red;
        }
        else if (contains(BLACK,value)) {
            return RedBlackEnum.Black;
        }
        else throw new Exception(ExceptionType.BetTypeMismatch, value.toString() + " not a red/black.");
    };
    /**
    *   Test if a value is within lower dozen, middle, or high
    *   @Param {Number} - Number to be tested
    *   @Return{DozensEnum} - Result of the test
    *   @Throws{Exception} BetTypeMismatch Exception 
    */
    this.isDozen = function (number) {
        if (isNumeric(number)) {
            if (number > 0 && number <= 12) {
                return DozensEnum.Low;
            }
            else if (number > 12 && number <= 24) {
                return DozensEnum.Mid
            }
            else if (number > 24 && number <= 36) {
                return DozensEnum.High;
            }
            else throw new Exception(ExceptionType.BetTypeMismatch, value.toString() + " not a dozen.");
        }
    };
    /**
    *   Test if a value is high or low(Manque/Passe)
    *   @Param {Number} - Number to be tested
    *   @Return{HighLowEnum} - Result of the test
    *   @Throws{Exception} BetTypeMismatch Exception 
    */
    this.ishighLow = function (value) {
        if (isNumeric(value)) {
            if (value > 0 && value <= 18) {
                return HighLowEnum.Low;
            }
            else if (value > 18) {
                return HighLowEnum.High;
            }
            else throw new Exception(ExceptionType.BetTypeMismatch, value.toString() + " not High Low.");
        }
    };

}


/**
*   Main bet selection menu for a player, this will ask the player to enter there type of bet
*   @param {Player} player - Current player selecting a type of bet
*/
function getPlayerBetChoice(player) {
    if (player === undefined) throw new Exception(ExceptionType.QuitPlayerPlaying, "Player undefined");
    else {
        var menuSelection;
        var message = "Enter a bet selection for Player " + player.Id + "\n" + MAINMENUSTRING;
        menuSelection = getNumericInput(message, 0, 6);
        if (menuSelection == 0) {
            player.BetType = BetTypeEnum.Cancelled;
            return -1;
        }

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
                    if (submenuSelection == DozensEnum.Low) player.BetType = BetTypeEnum.Low_Dozen;
                    else if (submenuSelection == DozensEnum.Mid) player.BetType = BetTypeEnum.Mid_Dozen;
                    else if (submenuSelection == DozensEnum.High) player.BetType = BetTypeEnum.High_Dozen;
                }
                break;
                /********** CASE 5 - Column 1/2/3 **************/
            case 6:
                submenuSelection = getNumericInput(submenuSelectionArray[menuSelection], 0, 3);//Object.keys(ColumnEnum).length);
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
}
/*
*   Prompt the user for an amount to bet
*   @Param {Player} player - Current player that is placing the bet 
*   @Todo: Add test for "£" signs
*/
function getBetAmount(player) {
    if (player === undefined) throw new Exception(ExceptionType.Undefined, "Player undefined.");
    else if (player.hasQuit()) throw new Exception(ExceptionType.QuitPlayerPlaying, "Quit player cannot play.");
    else {
        var input = getNumericInput("Player " + player.Id + "\nHow much do you want to bet (in £'s)?", 0, 100000);
        if (input == 0) player.BetType = BetTypeEnum.Cancelled;
        else player.BetAmount = input;
    }
}
/*
*   Prompt the user for the number of players, Maximum is defined as a constant.
*   @return {Number} Number of players.
*/
function getNumofPlayers(maxPlayers) {
    return getNumericInput("Enter the number of players who wish to play (between 1-" + maxPlayers + ")", 0, maxPlayers);
}

/**
*   Create a prompt window with a message and loop until a user inputs a valid number
*   @Param {String} message - Message to be displayed in the prompt window
*   @return {Number} Validated number
*/
function getNumericInput(message, lowerBounds, upperBounds) {
    var input;
    do {
        if (DEBUG.isEnabled && DEBUG.SimulateInput)
            input = parseInt(Math.floor((Math.random() * (upperBounds + 1)) + lowerBounds));
        else
            input = parseInt(window.prompt(message));
    } while (isNumeric(input) == false || input < lowerBounds || input > upperBounds)
    return input;
}
/**
*   Test if a value is a valid number
*   @Param {object} value - Value that is to be tested
*   @Return {boolean} True if the value is is a number otherwise false
*   @Throws{Exception} NotNumeric Exception 
*/
function isNumeric(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value))
        return true;
    else return false;//throw new Exception(Exception.NotNumeric, value.toString() + " Not a valid number");
}
/**
*   Replacement for Array.includes for browser compatibility
*   @Param{Array[Number]} arr - array to be tested
*   @param{Number} val - value to test if array contains
*/
function contains(arr, val) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i] === val)
            return true;
    return false;
}

/*
*   Handle html output
*   @Param{String} message - sting message to output
*/
function createHTMLText(div,message) {
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(message));
    p.appendChild(document.createElement("br"));
    div.appendChild(p);
}

function runGame(div) {
    //    if (navigator.userAgent.search("rv:11") != -1 || navigator.userAgent.search("MSIE") != -1)
    //        document.write("Browser identified itserlf as " + navigator.userAgent + "<br>" + "Sorry, this application requires features unsupported by \"Microsoft Internet Explorer.\"")
    //    else {

    var numberOfPlayers;
    if (DEBUG.isEnabled)
        numberOfPlayers = DEBUG.SimulationPlayers;
    else
        numberOfPlayers = getNumofPlayers(MAXPLAYERS);

    for (let i = 0; i < numberOfPlayers; i++) {
        players[i] = new PlayerObject();
        players[i].Id = i + 1;
        getPlayerBetChoice(players[i]);
        if (players[i].hasQuit() == false) {
            getBetAmount(players[i]);
        }
    }

    roulette.randomizeWinningNumber();

    createHTMLText(div, "The winning number is " + roulette.WinningNumber);
    players.forEach(function (player) {//(let i = 0; i < numberOfPlayers; i++) {
        let output = "";
        if (player.BetType === undefined)
            throw new Exception(ExceptionType.UndefinedBetType, player.toString() + " Player bet type is undefined");
        else if (player.hasQuit())
            output += "Player " + player.Id + " backed out.";
        else if (roulette.isWinner(player)) {
            output += "We have a winner, Congratulations Player " + player.Id + " has won £" + /*player.Winnings*/"(not  Implemented)" + " ";

            if (player.BetType != BetTypeEnum.Basic) {
                output += "with a bet on " + Object.keys(BetTypeEnum)[player.BetType] + "";
            }
            else
                output += "with number " + player.BetNumber;
        }
        else {
            output += ("Sorry Player " + player.Id + ", your not a winner this time. " + "You lost £" + player.BetAmount +
                " while betting on ");
            if (player.BetType == BetTypeEnum.Basic)
                output += player.BetNumber;
            else
                output += Object.keys(BetTypeEnum)[player.BetType];
            output += " Why not try and win it back.";
        }
        createHTMLText(div, output);
    })
}

/**
*   Test function to check randomness of rng and test bet type checks
*
*/
function testGameRandomness() {
    var game = new RouletteGame();
    var nums = [];
    var cycles = {
        isEven: 0, isOdd: 0, isRed: 0, isBlack: 0, isHigh: 0, isLow: 0, isColumn1: 0, isColumn2: 0, isColumn3: 0, isDozen1: 0, isDozen2: 0, isDozen3: 0
    };

    htmlMessageOut.innerHTML += "Running random cycle test " + DEBUG.Cycles + " times.<br>";

    for (let i = 0; i < DEBUG.Cycles; i++) {
        game.randomizeWinningNumber();
        nums[i] = game.WinningNumber;
    }
    nums.sort();
    var numsObj = {};
    var current = null;
    var count = 0;
    for (let i = 0; i < nums.length; i++) {
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
    for (let k in numsObj) {
        if (numsObj.hasOwnProperty(k))
            htmlMessageOut.innerHTML += "Number " + k + " Appeared " + numsObj[k] + " Times.<br>";
    }
    for (let i = 0; i < nums.length; i++) {
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

var htmlTitle = document.getElementById('title');
var htmlMessageOut = document.getElementById("appDiv");

if (DEBUG.isEnabled == true) {
    
    while (htmlMessageOut.hasChildNodes())
        htmlMessageOut.removeChild(htmlMessageOut.lastChild);
    htmlMessageOut.innerHTML = "";
    var testSelect = document.getElementById("testSelect");
    var btn = document.getElementById("testButton");
    btn.innerHTML = "Test";
    btn.addEventListener("click", function () {
        if (testSelect.options[testSelect.selectedIndex].value == 1)
            testGameRandomness();
        else if (testSelect.options[testSelect.selectedIndex].value == 2)
            for (let i = 0; i < DEBUG.Cycles; i++) {
                try {
                    runGame(htmlMessageOut);
                }
                catch (ex) {
                    console.log(ex.message);
                    DEBUG.Errors += 1;
                }
            }
    });
    document.getElementById("buttonDiv").appendChild(testSelect);
    document.getElementById("buttonDiv").appendChild(btn);
}
else
    runGame(htmlMessageOut);


/***** End Application */

