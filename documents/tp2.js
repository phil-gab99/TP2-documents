/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 1.8.0 2020-04-22
*
* This program aims to define an html page upon which the game of Poker
* shuffle, a type of solitary game, can be played following the general poker
* rules concerning the ranking of hand combinations and associating a score for
* how the main grid is filled
**/

// TODO: Unit tests
// TODO: Play the game to find bugs if any
// TODO: Prevent final alert message to display before content loaded

var mixDeck = []; //Array of randomly ordered cards in an integer encoding
var currCard = 0; //Index indicating the next card to be flipped from pile

//Dimensions determining size of playable grid
var rowsNum = 0;
var colsNum = 0;

var boardState = [[]]; //Matrix of integers indicating occupied cells in grid
var clickState = [];   //Array of booleans indicating when cell is clicked

/*
* The iota function is responsible for creating an array of determined length
* filled with integer values at its indexes ranging from 0 up to n-1
*
* @param n Integer indicating the length of the array to return
* @return table Array with the set length and values at its indexes ranging
* from 0 to n - 1
**/

var iota = function(n) {
    var table = [];
    if(Math.floor(n) == n && n >= 0) {
        table = Array(n).fill(0).map(
            function(_,i) {
                return i;
            }
        );
    }

    return table;
};

/*
* The shuffle function is responsible for generating an array with its elements
* randomly arranged from an initial ordered array
*
* @param deck Array with ordered elements
* @return shuffledDeck Copy of initial array but with randomly ordered elements
**/

var shuffle = function(deck) {

    var shuffledDeck = deck.slice().reverse();

    shuffledDeck = shuffledDeck.map(
        function(card, pos) {

            //Selecting a random card different from those already worked on
            var randCard = Math.floor(
                Math.random() * (shuffledDeck.length - pos)
            ) + pos;

            //Replacing randomly selected card so as to not duplicate it
            var temp = shuffledDeck[randCard];
            shuffledDeck[randCard] = card;
            return temp;
        }
    );
    return shuffledDeck;
};

/*
* The merge function is reponsible for merging two given arrays into a single
* ascendingly sorted array
*
* @param tab1 The first array to be merged
* @param tab2 The second array to be merged
* @return mergedTab The resulting sorted array of the merge
**/

var merge = function(tab1,tab2) {

    var i = 0; //Index for the first array
    var j = 0; //Index for the second array

    var mergedTab = Array(tab1.length + tab2.length).fill(0).map(
        function() {
            if (i < tab1.length && j < tab2.length) {
                if (tab1[i] < tab2[j]) return tab1[i++];
                else return tab2[j++];
            } else if (i < tab1.length) {
                return tab1[i++];
            } else {
                return tab2[j++];
            }
        }
    );

    return mergedTab;
};

/*
* The sort function is responsible for generating a copy of an array of
* integers with disordered elements but with its elements ascendingly sorted
* using a merge sort algorithm
*
* @param tab Disordered array of integers
* @return sortTab Copy of inputted array but sorted
**/

var sort = function(tab) {

    if (tab.length < 2) { //An array of a single elment is a sorted array
        return tab;
    } else {

        var mid = Math.floor(tab.length / 2);

        //Recursive calls to half the size of the passed array
        var tab1 = sort(tab.slice(0, mid));
        var tab2 = sort(tab.slice(mid, tab.length));

        var sortTab = merge(tab1,tab2);

        return sortTab;
    }
};

/*
* The indexToCoords function determines the coordinates in a two-dimensional
* array of a given cell number within the grid
*
* @param cellTag Integer indicating the cell number within grid
* @return coords Object containing the cell's coordinates within grid
**/

var indexToCoords = function(cellTag) {
    var coords = {
        row: Math.floor(cellTag / colsNum),
        col: cellTag % colsNum
    };
    return coords;
}

/*
* The getCol function retrieves a given column of a given two-dimensional array
* to then store it in an array for further analysis on each element of the
* column
*
* @param mat Two-dimensional array upon which a column is to be extracted
* @param col Integer indicating which column to extract
* @return column Array holding desired column for analysis
**/

var getCol = function(mat, col) {

    var column = mat.map(
        function(line) {
            return line[col];
        }
    );

    return column;
};

/*
* The getCardName function determines the name of the svg image file of a card
* based on an integer encoding of the cards as well as the reached current card
* in the shuffled deck pile
*
* @return cardName String indicating the file name of the correct image file
* corresponding with the next card in the shuffled deck pile
**/

var getCardName = function() {

    var cardName = "";

    //Determining the card's rank
    switch ((mixDeck[currCard] >> 2)) {
        case 0 : cardName += "A";  break;
        case 1 : cardName += "2";  break;
        case 2 : cardName += "3";  break;
        case 3 : cardName += "4";  break;
        case 4 : cardName += "5";  break;
        case 5 : cardName += "6";  break;
        case 6 : cardName += "7";  break;
        case 7 : cardName += "8";  break;
        case 8 : cardName += "9";  break;
        case 9 : cardName += "10"; break;
        case 10: cardName += "J";  break;
        case 11: cardName += "Q";  break;
        case 12: cardName += "K";  break;
    }

    //Determining the card's suit
    switch (mixDeck[currCard] & 3) {
        case 0: cardName += "C"; break;
        case 1: cardName += "S"; break;
        case 2: cardName += "H"; break;
        case 3: cardName += "D"; break;
    }

    return cardName;
};

/*
* The getCardNum function determines the correct integer encoding of a given
* card name from its inputted file path
*
* @param cardPath String indicating file path of card
* @return cardNum Integer representing the card encoding
**/

var getCardNum = function(cardPath) {

    var cardNum = 0;

    //Extracting card name from its file path
    var cardName = cardPath.split("/").pop().split(".").shift();

    //Determining the card's rank
    switch (cardName.slice(0,-1)) {
        case "A" : cardNum = 0;  break;
        case "2" : cardNum = 4;  break;
        case "3" : cardNum = 8;  break;
        case "4" : cardNum = 12; break;
        case "5" : cardNum = 16; break;
        case "6" : cardNum = 20; break;
        case "7" : cardNum = 24; break;
        case "8" : cardNum = 28; break;
        case "9" : cardNum = 32; break;
        case "10": cardNum = 36; break;
        case "J" : cardNum = 40; break;
        case "Q" : cardNum = 44; break;
        case "K" : cardNum = 48; break;
    }

    //Determining the card's suit
    switch (cardName.slice(-1)) {
        case "C": break;
        case "S": cardNum += 1; break;
        case "H": cardNum += 2; break;
        case "D": cardNum += 3; break;
    }

    return cardNum;
};

/*
* The calScore function determines a given array's score based on the known
* Poker hands and their ranking
*
* @param hand Array with cards in their integer encoding
* @return score Integer representing the score of the hand
**/

//Same suit --> x & 3  == y & 3
//Same rank --> x >> 2 == y >> 2
// NOTE: Consider forEach, check teacher's answer on matter

var calScore = function(hand) {

    var comb = true; //Boolean determining if hand corresponds with combination
    var score = 100; //Integer representing score for specific hand combination

    var card;        //The card from which the others will be compared

    /*
    * The quinteFlushRoyale function determines if the given hand combination
    * corresponds with the Quinte Flush Royale poker hand consisting of an Ace,
    * a King, a Queen, a Jack, and a 10 of the same suit
    *
    * @return comb Boolean determining whether Quinte Flush Royale combination
    * has been achieved or not
    **/

    var quinteFlushRoyale = function() {

        card = hand[0];

        if (card >> 2 == 0) { //Checking for the Ace card

            for (var i = 1; i < hand.length; i++) {

                //Conditions for breaking Quinte Royal Flush combination
                if ((hand[i] >> 2 != 8 + i) || ((hand[i] & 3) != (card & 3))) {

                    comb = false;
                    break;
                }
            }
        } else {
            comb = false;
        }
        return comb;
    };

    /*
    * The quinteFlush function determines if the given hand combination
    * corresponds with the Quinte Flush poker hand consisting cards of the same
    * suit and ranks arranged in numerical order
    *
    * @return comb Boolean determining whether Quinte Flush combination has
    * been achieved or not
    **/

    var quinteFlush = function() {

        if (hand.indexOf(52) == -1) { //Empty grid cell verification

            card = hand[0];

            for (var i = 1; i < hand.length; i++) {

                //Conditions for breaking Quinte Flush combination
                if (((hand[i] >> 2) - 1 != hand[i-1] >> 2)
                || ((hand[i] & 3) != (card & 3))) {

                    comb = false;
                    break;
                }
            }
        } else {
            comb = false;
        }
        return comb;
    };

    /*
    * The fourOfAKind function determines if the given hand combination
    * corresponds with the Four Of A Kind poker hand consisting of four cards
    * with matching rank and one side card
    *
    * @return comb Boolean determining whether Four Of A Kind combination has
    * been achieved or not
    **/

    var fourOfAKind = function() {

        //Last card in hand excluded from combination
        if (hand[0] >> 2 == hand[1] >> 2 && hand[0] != 52) {

            card = hand[0];

            for (var i = 2; i < hand.length - 1; i++) {

                //Conditions for breaking Four Of A Kind combination
                if (hand[i] >> 2 != card >> 2) {
                    comb = false;
                    break;
                }
            }

        //First card in hand excluded from combination
        } else if (hand[1] >> 2 == hand[2] >> 2 && hand[1] != 52) {

            card = hand[1];

            for (var i = 3; i < hand.length; i++) {

                //Conditions for breaking Four Of A Kind combination
                if (hand[i] >> 2 != card >> 2) {
                    comb = false;
                    break;
                }
            }
        } else {
            comb = false;
        }
        return comb;
    };

    /*
    * The fullHouse function determines if the given hand combination
    * corresponds with the Full House poker hand consisting of three cards of
    * the same rank and the other two of a different matching rank
    *
    * @return comb Boolean determining whether Full House combination has been
    * achieved or not
    **/

    var fullHouse = function() {

        if (hand.indexOf(52) == -1) { //Empty grid cell verification

            //Three first cards are of the same rank
            if ((hand[0] >> 2 == hand[1] >> 2)
            && (hand[0] >> 2 == hand[2] >> 2)) {

                //Last two cards of differing rank breaks the combination
                if (hand[3] >> 2 != hand[4] >> 2) comb = false;

            //Three last cards are of the same rank
            } else if ((hand[2] >> 2 == hand[3] >> 2)
            && (hand[2] >> 2 == hand[4] >> 2)) {

                //First two cards of differing rank breaks the combination
                if (hand[0] >> 2 != hand[1] >> 2) comb = false;

            } else {
                comb = false;
            }
        } else {
            comb = false;
        }
        return comb;
    };

    /*
    * The flush function determines if the given hand combination corresponds
    * with the Flush poker hand consisting of cards of the same suit
    *
    * @return comb Boolean determining whether Flush combination has been
    * achieved or not
    **/

    var flush = function() {

        if (hand.indexOf(52) == -1) { //Empty grid cell verification

            card = hand[0];

            for (var i = 1; i < hand.length; i++) {

                //Condition for breaking Flush combination
                if ((hand[i] & 3) != (card & 3)) {

                    comb = false;
                    break;
                }
            }
        } else {
            comb = false;
        }
        return comb;
    };

    /*
    * The quinte function determines if the given hand combination corresponds
    * with the Quinte poker hand consisting of cards with ranks arranged in
    * numerical order including the special order of 10, Jack, Queen, King, Ace
    *
    * @return comb Boolean determining whether Quinte combination has been
    * achieved or not
    **/

    var quinte = function() {

        if (hand.indexOf(52) == -1) { //Empty grid cell verification

            card = hand[0];

            if (card >> 2 == 0) { //First card Ace has two valid combinations

                for (var i = 1; i < hand.length; i++) {

                    //Conditions for breaking both valid Quinte combinations
                    if ((hand[i] >> 2 != 8 + i) && (hand[i] >> 2 != i)) {

                        comb = false;
                        break;
                    }
                }
            } else {

                for (var i = 1; i < hand.length; i++) {

                    //Condition for breaking Quinte combination
                    if ((hand[i] >> 2) - 1 != hand[i-1] >> 2) {

                        comb = false;
                        break;
                    }
                }
            }
        } else {
            comb = false;
        }
        return comb;
    };

    /*
    * The threeOfAKind function determines if the given hand combination
    * corresponds with the Three Of A Kind poker hand consisting of three cards
    * of matching rank and two unrelated side cards
    *
    * @return comb Boolean determining whether Three Of A Kind combination has
    * been achieved or not
    **/

    var threeOfAKind = function() {

        comb = false;

        for (var i = 2; i < hand.length; i++) {

            //Conditions verifying Three Of A Kind combination
            if ((hand[i] != 52) && ((hand[i] >> 2 == hand[i-1] >> 2)
            && (hand[i] >> 2 == hand[i-2] >> 2))) {

                comb = true;
                break;
            }
        }
        return comb;
    };

    /*
    * The twoPairs function determines if the given hand combination
    * corresponds with the Two Pairs poker hand consisting of two cards with
    * matching rank and another two cards of a different matching rank and one
    * side card
    *
    * @return comb Boolean determining whether Two Pairs combination has been
    * achieved or not
    **/

    var twoPairs = function() {

        comb = false;

        firstPair:
        for (var i = 1; i < hand.length; i++) {

            //Condition verifying presence of first pair
            if (hand[i] != 52 && hand[i] >> 2 == hand[i-1] >> 2) {

                for (var j = i + 1; j < hand.length; j++) {

                    //Condition verifying presence of second pair
                    if (hand[j] != 52 && hand[j] >> 2 == hand[j-1] >> 2) {

                        comb = true;
                        break firstPair;
                    }
                }
            }
        }
        return comb;
    };

    /*
    * The pairs function determines if the given hand combination
    * corresponds with the Pairs poker hand consisting of two cards of matching
    * rank and three unrelated side cards
    *
    * @return comb Boolean determining whether Pairs combination has been
    * achieved or not
    **/

    var pair = function() {

        comb = false;

        for (var i = 1; i < hand.length; i++) {

            //Condition verifying Pair combination
            if (hand[i] != 52 && hand[i] >> 2 == hand[i-1] >> 2) {

                comb = true;
                break;
            }
        }
        return comb;
    };

    //Scores are assigned with respect to the ranking of the hand combination
    if (quinteFlushRoyale()) return score; else comb = true; score = 75;
    if (quinteFlush())       return score; else comb = true; score = 50;
    if (fourOfAKind())       return score; else comb = true; score = 25;
    if (fullHouse())         return score; else comb = true; score = 20;
    if (flush())             return score; else comb = true; score = 15;
    if (quinte())            return score; else comb = true; score = 10;
    if (threeOfAKind())      return score; else comb = true; score = 5;
    if (twoPairs())          return score; else comb = true; score = 2;
    if (pair())              return score; else return 0;
};

/*
* The scoreSystem procedure displays the user's score for each row and each
* column of the grid as well as their total score updated throughout each move
* and displays the final score after the grid has been filled
**/

var scoreSystem = function() {

    var rScore = 0; //Integer holding the score of a row
    var cScore = 0; //Integer holding the score of a column
    var tScore = 0; //Integer holding the total score of the grid

    var filled = true; //Boolean indicating if grid has been filled

    boardState.forEach(
        function(line, pos) {
            rScore = calScore(sort(line));
            document.getElementById('R' + pos).innerHTML
            = (rScore == 0) ? "" : rScore;

            cScore = calScore(sort(getCol(boardState,pos)));
            document.getElementById('C' + pos).innerHTML
            = (cScore == 0) ? "" : cScore;

            tScore += rScore + cScore;

            //Game continues until every grid is filled
            if (line.indexOf(52) != -1) filled = false;
        }
    );

    document.getElementById('T').innerHTML = tScore;

    if (filled) {
        alert("Votre pointage final est " + tScore);
        init();
    }
};

/*
* The clic procedure manages the allowed moves which the user can undertake in
* the poker shuffle game while also providing visual cues so as to which cards
* the user is interacting with
*
* @param id Integer indicating the cell id with which the user has interacted
**/

var clic = function(id) {

    //Contents of selected cell
    var cell = document.getElementById(id).innerHTML;

    //Retrieving positions on grid of deck cell and previously selected cell
    var deckCell   = clickState.length - 1;
    var activeCell = clickState.indexOf(true);

    //Retrieving selected cell's and active cell's coordinates on grid
    var coords = indexToCoords(id);
    if (activeCell != -1) var preCoords = indexToCoords(activeCell);

    //File paths for each card state
    var back      = '<img src="cards/back.svg">';
    var empty     = '<img src="cards/empty.svg">';
    var deckCard  = '<img src="cards/'+ getCardName() +'.svg">'; //Card in pile

    var boardCard = ''; //Card name of previously selected card on grid
    var temp      = ''; //Temporary card name for exchanging cards

    var slct  = 'lime';        //Cell color for a selected card
    var dslct = 'transparent'; //Cell color for a non-selected card

    if (cell == back) { //Face-down deck pile selected

        if (activeCell != -1) { //Checking for other selected cards
            document.getElementById(activeCell).style.backgroundColor = dslct;
            clickState[activeCell] = false;
        }

        document.getElementById(id).innerHTML = deckCard;
        document.getElementById(id).style.backgroundColor = slct;
        clickState[id] = true;

    } else if (cell == empty){ //Empty cell grid selected

        if (activeCell == deckCell) {

            //Placing card from deck pile onto grid
            document.getElementById(id).innerHTML = deckCard;
            document.getElementById(deckCell).innerHTML = back;
            boardState[coords.row][coords.col] = getCardNum(deckCard);

            currCard ++; //Next card of deck pile is set
            document.getElementById(deckCell).style.backgroundColor = dslct;
            clickState[deckCell] = false;

        } else if (activeCell != -1) { //Previously selected card within grid

            //Moving card within grid onto different empty grid space
            boardCard = document.getElementById(activeCell).innerHTML;
            document.getElementById(id).innerHTML = boardCard;
            document.getElementById(activeCell).innerHTML = empty;
            boardState[coords.row][coords.col] = getCardNum(boardCard);
            boardState[preCoords.row][preCoords.col] = 52;

            document.getElementById(activeCell).style.backgroundColor = dslct;
            clickState[activeCell] = false;
        }

    } else { //Face-up card is selected

        if (activeCell == id) {

            //Selecting the same previously selected card deselects it
            document.getElementById(id).style.backgroundColor = dslct;
            clickState[id] = false;

        } else if (activeCell == deckCell) { //Previously selected deck pile

            //Prevent moving card from deck pile unto occupied grid space
            document.getElementById(deckCell).style.backgroundColor = dslct;
            document.getElementById(id).style.backgroundColor = slct;
            clickState[deckCell] = false;
            clickState[id] = true;

        } else if (activeCell != -1) { //Previously selected card on grid

            if (id == deckCell) {

                //Prevent moving card from grid unto deck pile
                document.getElementById(activeCell).style.backgroundColor
                = dslct;
                document.getElementById(id).style.backgroundColor = slct;
                clickState[activeCell] = false;
                clickState[id] = true;

            } else {

                //Exchanging two cards' positions on the grid
                boardCard = document.getElementById(activeCell).innerHTML;
                temp = document.getElementById(id).innerHTML;
                document.getElementById(id).innerHTML = boardCard;
                document.getElementById(activeCell).innerHTML = temp;
                boardState[coords.row][coords.col] = getCardNum(boardCard);
                boardState[preCoords.row][preCoords.col] = getCardNum(temp);

                document.getElementById(activeCell).style.backgroundColor
                = dslct;
                clickState[activeCell] = false;

            }

        } else { //No previously selected cards
            document.getElementById(id).style.backgroundColor = slct;
            clickState[id] = true;
        }
    }
    scoreSystem();
};

/*
* The loadUI procedure is responsible for generating the user interface through
* which the game will be played
*
* @param rowsNum Integer indicating amount of rows on playable grid
* @param colsNum Integer indicating amount of columns on playable grid
**/

var loadUI = function(rowsNum,colsNum) {

    var content = ""; //String holding the contents of the html page

    //Integers necessary for determining each grid cell's id
    var pos = 0;
    var lastPos = rowsNum * colsNum;

    //Section of user interface keeping same format regardless of dimensions
    content += '' +
    '<table>' +
        '<tr>' +
            '<td>' +
                '<button onclick="init()" style="float:left;">' +
                    'Nouvelle partie' +
                '</button>' +
            '</td>' +
            '<td></td>' +
            '<td id="' + lastPos + '" onclick="clic(' + lastPos + ')">' +
                '<img src="cards/back.svg">' +
            '</td>' +
            '<td></td>' +
        '</tr>' +
    '</table>';

    //Generating main area of the grid
    content += '<table>';

    for (var i = 0; i < rowsNum; i++) {
        content += '<tr>'
        for (var j = 0; j < colsNum; j++) {
            pos = rowsNum * i + j;
            content += '' +
            '<td id="' + pos + '" onclick="clic(' + pos + ')">' +
                '<img src="cards/empty.svg">' +
            '</td>';
        }
        //Last grid cell holding horizontal score
        content += '<td id="R' + i + '"></td></tr>';
    }

    //Generating the last grid cells row holding vertical score
    content += '<tr>';

    for (var i = 0; i < colsNum; i++) {
        content += '<td id="C' + i + '"></td>';
    }

    //Last grid cell holding total score
    content += '<td id="T">0</td></tr></table>';

    document.getElementById('b').innerHTML = content;
};

/*
* The init procedure initializes the shuffled deck as well as its index,
* prepares the necessary arrays that will monitor the game data for
* further actions and loads the user interface upon which the game will be
* played
**/

var init = function() {

    var deckSize = 52; //Integer indicating size of deck of cards
    currCard = 0;      //Initializing deck pile at first card

    rowsNum = 5;
    colsNum = 5;

    mixDeck = shuffle(iota(deckSize));

    //Cards on grid empty by default in matrix format
    boardState = Array(colsNum).fill(0).map(
        function(_) {
            return Array(rowsNum).fill(52);
        }
    );

    //Cards on grid including deck pile not selected by default
    clickState = Array(rowsNum * colsNum + 1).fill(false);

    loadUI(rowsNum,colsNum);
};

/*
* The test procedures below serve for unit based test cases for their
* corresponding function
**/

var testIota = function() {
    assert(iota(4)     == "0,1,2,3");
    assert(iota(0)     == "");
    assert(iota(1)     == "0");
    assert(iota(-1)    == "");
    assert(iota("abc") == "");
};