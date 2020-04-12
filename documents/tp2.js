/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 1.39.8 2020-04-22
*
* This program aims to define an html page upon which the game of Poker
* Shuffle, a type of solitary game, can be played following the general poker
* rules concerning the ranking of hand combinations and associating a score for
* how the main grid is filled
**/

// TODO: Play the game to find bugs if any
// TODO: Test on Safari browser to adjust setTimeout() method if need be

var mixDeck = []; //Array of randomly ordered cards in an integer encoding
var currCard = 0; //Index indicating the next card to be flipped from pile

//Dimensions determining size of playable grid
var rowsNum = 5;
var colsNum = 5;

var boardState = [[]]; //Matrix of integers indicating occupied cells in grid
var clickState = [];   //Array of booleans indicating when cell is clicked

/*
* The iota function is responsible for creating an array of determined length
* filled with integer values at its indexes in descending order ranging from
* n-1 up to 0
*
* @param n Integer indicating the length of the array to return
* @return table Array with the set length and values at its indexes ranging
* from 0 to n - 1
**/

var iota = function(n) {
    var table = [];
    if(Math.floor(n) == n && n >= 0) {
        table = Array(n).fill(n - 1).map(
            function(x,i) {
                return x - i;
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

    var shuffledDeck = deck.slice();

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
    //Final deck consisting of as many cards as cells on grid
    return shuffledDeck.slice(0, rowsNum * colsNum);
};

/*
* The merge function is reponsible for merging two given ascendingly sorted
* arrays into a single single ascendingly sorted array
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
* The removeEmpty function removes the specified empty cell encoding of a
* sorted hand array so as to lead a desired analysis on the cards only
*
* @param hand Array describing the present cards including empty cells
* @param empty Integer indicating specific number encoding for an empty cell
* being the highest among the encoding of other cards
* @return handCards Array describing the present cards excluding empty cells
**/

var removeEmpty = function(hand,empty) {

    var handCards = sort(hand);

    var emptyCell = handCards.indexOf(empty); //Retrieving empty cell position

    if (emptyCell != -1) {
        handCards.splice(emptyCell);
    }

    return handCards;
};

/*
* The getCardName function determines the name of the svg image file of a card
* based on an integer encoding of the cards as well as the reached current card
* in the shuffled deck pile
*
* @param cardNum Integer representing the card encoding
* @return cardName String indicating the file name of the correct image file
* and if the file is not found, takes the value of an empty string
**/

var getCardName = function(cardNum) {

    var cardName = "";

    //Determining the card's rank
    switch (cardNum >> 2) {
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
        default:
            if (cardNum == 52) {
                cardName = "empty";
            } else if (cardNum == 53) {
                cardName = "back";
            }
            return cardName;

    }

    //Determining the card's suit
    switch (cardNum & 3) {
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
* @return cardNum Integer representing the card encoding and if the card is not
* found, takes the value of -1
**/

var getCardNum = function(cardPath) {

    var cardNum = -1;

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
        default  :
            if (cardName == "empty") {
                cardNum = 52;
            } else if (cardName == "back") {
                cardNum = 53;
            }
            return cardNum;
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
* The following score system will be applied during hand analysis:
*       Combination: Quinte Flush Royale; Score: 100
*       Combination: Quinte Flush;        Score: 75
*       Combination: Four Of A Kind;      Score: 50
*       Combination: Full House;          Score: 25
*       Combination: Flush;               Score: 20
*       Combination: Quinte;              Score: 15
*       Combination: Three Of A Kind;     Score: 10
*       Combination: Two Pairs;           Score: 5
*       Combination: Pair;                Score: 2
*
* @param hand Array with cards in their integer encoding
* @return score Integer representing the score of the hand
**/

var calScore = function(hand) {

    var comb = true; //Boolean determining if hand corresponds with combination
    var score = 0;   //Integer representing score for specific hand combination

    /*
    * The quinteFlushRoyale function determines if the given hand combination
    * corresponds with the Quinte Flush Royale poker hand consisting of an Ace,
    * a King, a Queen, a Jack, and a 10 of the same suit
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Quinte Flush Royale combination
    * has been achieved or not
    **/

    var quinteFlushRoyale = function(cards) {

        comb = false;

        //Conditions for respecting Quinte Royal Flush combination
        if ((cards[cards.length - 1] >> 2) - (cards[0] >> 2) == 12) {

            comb = true;
        }
        return comb;
    };

    /*
    * The flush function determines if the given hand combination corresponds
    * at least with the Flush poker hand consisting of cards of the same suit
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Flush combination has been
    * achieved or not
    **/

    var flush = function(cards) {

        comb = true;

        for (var i = 1; i < cards.length; i++) {

            //Condition for breaking Flush combination
            if ((cards[i] & 3) != (cards[i-1] & 3)) {

                comb = false;
                break;
            }
        }

        return comb;
    };

    /*
    * The quinte function determines if the given hand combination corresponds
    * at least with the Quinte poker hand consisting of cards with ranks
    * arranged in numerical order including the special order of a 10, a Jack,
    * a Queen, a King and an Ace
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Quinte combination has been
    * achieved or not
    **/

    var quinte = function(cards) {

        comb = false;

        //Conditions for respecting Quinte combination including special case
        if ((cards[cards.length - 1] >> 2) - (cards[0] >> 2) == 4) {

            comb = true;

        } else if (cards[0] >> 2 == 0) { //Special combination case

            if ((cards[cards.length - 1] >> 2) - (cards[1] >> 2) == 3) {

                comb = true;
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
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Two Pairs combination has been
    * achieved or not
    **/

    var twoPairs = function(cards) {

        comb = false;

        if (cards.length >= 4) {

            for (var i = 4; i <= cards.length; i++) {

                //Condition consists of having two different pairs of cards
                if (pair(cards.slice(i-2,i)) && pair(cards.slice(i-4,i-2))) {

                    comb = true;
                    break;
                }

                if (i == 5) { //Special case when side card is in the middle

                    if ((pair(cards.slice(i-2,i))
                    && pair(cards.slice(i-5,i-3)))) {

                        comb = true;
                    }
                }
            }
        }

        return comb;
    };

    /*
    * The fullHouse function determines if the given hand combination
    * corresponds with the Full House poker hand consisting of three cards of
    * the same rank and the other two of a different matching rank
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Full House combination has been
    * achieved or not
    **/

    var fullHouse = function(cards) {

        comb = false;

        if (cards.length == 5) {

            //Three Of A Kind and Pair constitute the condition for Full House
            if ((threeOfAKind(cards.slice(0,3)) && pair(cards.slice(3)))
            || (pair(cards.slice(0,2)) && threeOfAKind(cards.slice(2)))) {

                comb = true;
            }
        }

        return comb;
    };

    /*
    * The fourOfAKind function determines if the given hand combination
    * corresponds with the Four Of A Kind poker hand consisting of four cards
    * with matching rank and one side card
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Four Of A Kind combination has
    * been achieved or not
    **/

    var fourOfAKind = function(cards) {

        comb = false;

        if (cards.length >= 4) {

            for (var i = 3; i < cards.length; i++) {

                //Condition verifying Four Of A Kind combination
                if ((cards[i] >> 2) == (cards[i-3] >> 2)) {

                    comb = true;
                    break;
                }
            }
        }

        return comb;
    };

    /*
    * The threeOfAKind function determines if the given hand combination
    * corresponds at least with the Three Of A Kind poker hand consisting of
    * three cards of matching rank and two unrelated side cards
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Three Of A Kind combination has
    * been achieved or not
    **/

    var threeOfAKind = function(cards) {

        comb = false;

        if (cards.length >= 3) {

            for (var i = 2; i < cards.length; i++) {

                //Condition verifying Three Of A Kind combination
                if ((cards[i] >> 2) == (cards[i-2] >> 2)) {

                    comb = true;
                    break;
                }
            }
        }

        return comb;
    };

    /*
    * The pairs function determines if the given hand combination corresponds
    * at least with the Pairs poker hand consisting of two cards of matching
    * rank and three unrelated side cards
    *
    * @param cards Array consisting of the hand of cards to analyze
    * @return comb Boolean determining whether Pairs combination has been
    * achieved or not
    **/

    var pair = function(cards) {

        comb = false;

        for (var i = 1; i < cards.length; i++) {

            //Condition verifying Pair combination
            if ((cards[i] >> 2) == (cards[i-1] >> 2)) {

                comb = true;
                break;
            }
        }

        return comb;
    };

    if (hand.length >= 2) { //Minimal condition for respecting a combination

        if (pair(hand)) { //Hand contains at least a Pair

            if (threeOfAKind(hand)) { //Hand contains at least Three Of A Kind

                //Hand evaluated to be one of three below combinations
                if (fourOfAKind(hand)) score = 50;
                else if (fullHouse(hand)) score = 25;
                else score = 10;

            } else if (twoPairs(hand)) { //Hand evaluated to be Two Pairs
                score = 5;
            } else { //Hand evaluated to be Pair
                score = 2;
            }
        } else {

            if (hand.length == 5) {

                //Both these combinations constitute Quinte Flush combination
                if (flush(hand) && quinte(hand)) {

                    //Hand evaluated to be one of two below combinations
                    if (quinteFlushRoyale(hand)) score = 100;
                    else score = 75;

                } else if (flush(hand)) { //Hand evaluated to be Flush
                    score = 20;
                } else if (quinte(hand)) { //Hand evaluated to be Quinte
                    score = 15;
                }
            }
        }
    }

    return score;
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

    var rCellScore;                                //Row scores HTML element
    var cCellScore;                                //Column scores HTML element
    var tCellScore = document.getElementById('T'); //Total score HTML element

    var filled = true; //Boolean indicating if grid has been filled

    boardState.forEach(
        function(line, pos) {

            rCellScore = document.getElementById('R' + pos);
            rScore = calScore(removeEmpty(line,52));
            rCellScore.innerHTML = (rScore == 0) ? "" : rScore;

            cCellScore = document.getElementById('C' + pos);
            cScore = calScore(removeEmpty(getCol(boardState,pos),52));
            cCellScore.innerHTML = (cScore == 0) ? "" : cScore;

            tScore += rScore + cScore;

            //Game continues until every grid is filled
            if (line.indexOf(52) != -1) filled = false;
        }
    );

    tCellScore.innerHTML = tScore;

    if (filled) {
        setTimeout(function() { //Wait until content is loaded before pop-up
            alert("Votre pointage final est " + tScore);
            init();
        }, 1)
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

    //Retrieving positions on grid of deck cell and previously selected cell
    var deckCell   = clickState.length - 1;
    var activeCell = clickState.indexOf(true);

    //Currently selected card and its coordinates
    var card = document.getElementById(id);
    var coords = indexToCoords(id);

    //Previously selected card and its coordinates
    if (activeCell != -1) {
        var preCard = document.getElementById(activeCell);
        var preCoords = indexToCoords(activeCell);
    }

    //Deck pile
    var deckPile = document.getElementById(deckCell);

    //File paths for each card state
    var back     = '<img src="cards/back.svg">';
    var empty    = '<img src="cards/empty.svg">';
    var deckCard =
    '<img src="cards/' + getCardName(mixDeck[currCard]) + '.svg">';

    var boardCard = ''; //Card name of previously selected card on grid
    var temp      = ''; //Temporary card name for exchanging cards

    var slct  = 'lime';        //Cell color for a selected card
    var dslct = 'transparent'; //Cell color for a non-selected card

    if (card.innerHTML == back) { //Face-down deck pile selected

        if (activeCell != -1) { //Checking for other selected cards
            preCard.style.backgroundColor = dslct;
            clickState[activeCell] = false;
        }

        card.innerHTML = deckCard;
        card.style.backgroundColor = slct;
        clickState[id] = true;

    } else if (card.innerHTML == empty){ //Empty cell grid selected

        if (activeCell == deckCell) {

            //Placing card from deck pile onto grid
            card.innerHTML = deckCard;
            deckPile.innerHTML = back;
            boardState[coords.row][coords.col] = mixDeck[currCard++];

            deckPile.style.backgroundColor = dslct;
            clickState[deckCell] = false;

        } else if (activeCell != -1) { //Previously selected card within grid

            //Moving card within grid onto different empty grid space
            boardCard = preCard.innerHTML;
            card.innerHTML = boardCard;
            preCard.innerHTML = empty;
            boardState[coords.row][coords.col] = getCardNum(boardCard);
            boardState[preCoords.row][preCoords.col] = 52;

            preCard.style.backgroundColor = dslct;
            clickState[activeCell] = false;
        }

    } else { //Face-up card is selected

        if (activeCell == id) {

            //Selecting the same previously selected card deselects it
            card.style.backgroundColor = dslct;
            clickState[id] = false;

        } else if (activeCell == deckCell) { //Previously selected deck pile

            //Prevent moving card from deck pile unto occupied grid space
            deckPile.style.backgroundColor = dslct;
            card.style.backgroundColor = slct;
            clickState[deckCell] = false;
            clickState[id] = true;

        } else if (activeCell != -1) { //Previously selected card on grid

            if (id == deckCell) {

                //Prevent moving card from grid unto deck pile
                preCard.style.backgroundColor = dslct;
                card.style.backgroundColor = slct;
                clickState[activeCell] = false;
                clickState[id] = true;

            } else {

                //Exchanging two cards' positions on the grid
                boardCard = preCard.innerHTML;
                temp = card.innerHTML;
                card.innerHTML = boardCard;
                preCard.innerHTML = temp;
                boardState[coords.row][coords.col] = getCardNum(boardCard);
                boardState[preCoords.row][preCoords.col] = getCardNum(temp);

                preCard.style.backgroundColor = dslct;
                clickState[activeCell] = false;

            }

        } else { //No previously selected cards
            card.style.backgroundColor = slct;
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
    console.assert(iota(4)     == "3,2,1,0");
    console.assert(iota(0)     == "");
    console.assert(iota(1)     == "0");
    console.assert(iota(-1)    == "");
    console.assert(iota("abc") == "");
};

var testMerge = function() {
    console.assert(merge([0,1,2,3],[4,5,6,7])         == "0,1,2,3,4,5,6,7");
    console.assert(merge([3,2,1,0],[7,6,5,4])         == "3,2,1,0,7,6,5,4");
    console.assert(merge([0,4,6,7],[1,2,3,5])         == "0,1,2,3,4,5,6,7");
    console.assert(merge([6,2,4,0],[5,7,1,3])         == "5,6,2,4,0,7,1,3");
    console.assert(merge([7],[0,1,2,3,4,5,6])         == "0,1,2,3,4,5,6,7");
    console.assert(merge([0,1,2,3,4,5,6],[7])         == "0,1,2,3,4,5,6,7");
    console.assert(merge([4,0],[6,2,1,5,7,3])         == "4,0,6,2,1,5,7,3");
    console.assert(merge([6,2,1,5,7,3],[4,0])         == "4,0,6,2,1,5,7,3");
    console.assert(merge([0,0,1,1],[0,0,2,2])         == "0,0,0,0,1,1,2,2");
    console.assert(merge([1,2,0,1],[2,2,2,2])         == "1,2,2,2,2,2,0,1");
    console.assert(merge([7,2],[2,2,7,7,0,0])         == "2,2,7,7,0,0,7,2");
    console.assert(merge([2,2,7,7,0,0],[7,2])         == "2,2,7,2,7,7,0,0");
    console.assert(merge([],[0,1,2,3,4,5,6,7])        == "0,1,2,3,4,5,6,7");
    console.assert(merge([0,1,2,3,4,5,6,7],[])        == "0,1,2,3,4,5,6,7");
    console.assert(merge([],[6,0,2,1,5,7,4,3])        == "6,0,2,1,5,7,4,3");
    console.assert(merge([6,0,2,1,5,7,4,3],[])        == "6,0,2,1,5,7,4,3");
    console.assert(merge([],[])                       == "");
    console.assert(merge(['a','b','c'],['d','e','f']) == "a,b,c,d,e,f");
    console.assert(merge(['c','a','b'],['f','d','e']) == "c,a,b,f,d,e");
    console.assert(merge(['b','f','a'],['e','d','c']) == "b,e,d,c,f,a");
    console.assert(merge(['c'],['a','b','d','e','f']) == "a,b,c,d,e,f");
    console.assert(merge(['a','b','d','e','f'],['c']) == "a,b,c,d,e,f");
    console.assert(merge(['d','a'],['c','f','b','e']) == "c,d,a,f,b,e");
    console.assert(merge(['c','f','b','e'],['d','a']) == "c,d,a,f,b,e");
    console.assert(merge(['a','a','b'],['b','b','a']) == "a,a,b,b,a,b");
    console.assert(merge(['b','b','a'],['a','a','b']) == "a,a,b,b,b,a");
    console.assert(merge(['c','c'],['a','c','b','e']) == "a,c,b,c,c,e");
    console.assert(merge(['a','c','b','e'],['c','c']) == "a,c,c,c,b,e");
    console.assert(merge([''],['a','b','c'])          == ",a,b,c");
    console.assert(merge(['a','b','c'],[''])          == ",a,b,c");
    console.assert(merge([''],['b','c','a'])          == ",b,c,a");
    console.assert(merge(['b','c','a'],[''])          == ",b,c,a");
    console.assert(merge(['A','B','C'],['D','E','F']) == "A,B,C,D,E,F");
    console.assert(merge(['C','A','B'],['F','D','E']) == "C,A,B,F,D,E");
    console.assert(merge(['B','F','A'],['E','D','C']) == "B,E,D,C,F,A");
    console.assert(merge(['C'],['A','B','D','E','F']) == "A,B,C,D,E,F");
    console.assert(merge(['A','B','D','E','F'],['C']) == "A,B,C,D,E,F");
    console.assert(merge(['D','A'],['C','F','B','E']) == "C,D,A,F,B,E");
    console.assert(merge(['C','F','B','E'],['D','A']) == "C,D,A,F,B,E");
    console.assert(merge(['A','A','B'],['B','B','A']) == "A,A,B,B,A,B");
    console.assert(merge(['B','B','A'],['A','A','B']) == "A,A,B,B,B,A");
    console.assert(merge(['C','C'],['A','C','B','E']) == "A,C,B,C,C,E");
    console.assert(merge(['A','C','B','E'],['C','C']) == "A,C,C,C,B,E");
    console.assert(merge([''],['A','B','C'])          == ",A,B,C");
    console.assert(merge(['A','B','C'],[''])          == ",A,B,C");
    console.assert(merge([''],['B','C','A'])          == ",B,C,A");
    console.assert(merge(['B','C','A'],[''])          == ",B,C,A");
    console.assert(merge([''],[''])                   == ",");
};

var testSort = function() {
    console.assert(sort([0,1,2,3,4,5,6,7])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([3,2,1,0,7,6,5,4])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([0,4,6,7,1,2,3,5])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([6,2,4,0,5,7,1,3])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([7,0,1,2,3,4,5,6])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([4,0,6,2,1,5,7,3])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([6,2,1,5,7,3,4,0])         == "0,1,2,3,4,5,6,7");
    console.assert(sort([0,0,1,1,0,0,2,2])         == "0,0,0,0,1,1,2,2");
    console.assert(sort([1,2,0,1,2,2,2,2])         == "0,1,1,2,2,2,2,2");
    console.assert(sort([7,2,2,2,7,7,0,0])         == "0,0,2,2,2,7,7,7");
    console.assert(sort([2,2,7,7,0,0,7,2])         == "0,0,2,2,2,7,7,7");
    console.assert(sort([2,1])                     == "1,2");
    console.assert(sort([1,2])                     == "1,2");
    console.assert(sort([1])                       == "1");
    console.assert(sort([])                        == "");
    console.assert(sort(['a','b','c','d','e','f']) == "a,b,c,d,e,f");
    console.assert(sort(['c','a','b','f','d','e']) == "a,b,c,d,e,f");
    console.assert(sort(['b','f','a','e','d','c']) == "a,b,c,d,e,f");
    console.assert(sort(['c','a','b','d','e','f']) == "a,b,c,d,e,f");
    console.assert(sort(['a','b','d','e','f','c']) == "a,b,c,d,e,f");
    console.assert(sort(['d','a','c','f','b','e']) == "a,b,c,d,e,f");
    console.assert(sort(['c','f','b','e','d','a']) == "a,b,c,d,e,f");
    console.assert(sort(['a','a','b','b','b','a']) == "a,a,a,b,b,b");
    console.assert(sort(['b','b','a','a','a','b']) == "a,a,a,b,b,b");
    console.assert(sort(['c','c','a','c','b','e']) == "a,b,c,c,c,e");
    console.assert(sort(['a','c','b','e','c','c']) == "a,b,c,c,c,e");
    console.assert(sort(['','a','b','c'])          == ",a,b,c");
    console.assert(sort(['a','b','c',''])          == ",a,b,c");
    console.assert(sort(['','b','c','a'])          == ",a,b,c");
    console.assert(sort(['b','c','a',''])          == ",a,b,c");
    console.assert(sort(['A','B','C','D','E','F']) == "A,B,C,D,E,F");
    console.assert(sort(['C','A','B','F','D','E']) == "A,B,C,D,E,F");
    console.assert(sort(['B','F','A','E','D','C']) == "A,B,C,D,E,F");
    console.assert(sort(['C','A','B','D','E','F']) == "A,B,C,D,E,F");
    console.assert(sort(['A','B','D','E','F','C']) == "A,B,C,D,E,F");
    console.assert(sort(['D','A','C','F','B','E']) == "A,B,C,D,E,F");
    console.assert(sort(['C','F','B','E','D','A']) == "A,B,C,D,E,F");
    console.assert(sort(['A','A','B','B','B','A']) == "A,A,A,B,B,B");
    console.assert(sort(['B','B','A','A','A','B']) == "A,A,A,B,B,B");
    console.assert(sort(['C','C','A','C','B','E']) == "A,B,C,C,C,E");
    console.assert(sort(['A','C','B','E','C','C']) == "A,B,C,C,C,E");
    console.assert(sort(['','A','B','C'])          == ",A,B,C");
    console.assert(sort(['A','B','C',''])          == ",A,B,C");
    console.assert(sort(['','B','C','A'])          == ",A,B,C");
    console.assert(sort(['B','C','A',''])          == ",A,B,C");
    console.assert(sort([''])                      == "")
};

var testIndexToCoords = function() {
    console.assert([indexToCoords(0).row, indexToCoords(0).col]   == "0,0");
    console.assert([indexToCoords(7).row, indexToCoords(7).col]   == "1,2");
    console.assert([indexToCoords(11).row, indexToCoords(11).col] == "2,1");
    console.assert([indexToCoords(13).row, indexToCoords(13).col] == "2,3");
    console.assert([indexToCoords(17).row, indexToCoords(17).col] == "3,2");
    console.assert([indexToCoords(22).row, indexToCoords(22).col] == "4,2");
    console.assert([indexToCoords(24).row, indexToCoords(24).col] == "4,4");
};

var testGetCol = function() {
    console.assert(
        getCol([[1,2,3],[4,5,6],[7,8,9]], 0)                   == "1,4,7"
    );
    console.assert(
        getCol([["a","b","c"],["d","e","f"],["g","h","i"]], 2) == "c,f,i"
    );
    console.assert(
        getCol([[1,"a","2"],["b","3",4],["5",6,"c"]], 1)       == "a,3,6"
    );
    console.assert(
        getCol([[1,2],["a",""],[3,"b"]], 1)                    == "2,,b"
    );
    console.assert(
        getCol([[""],[""],[""]], 0)                            == ",,"
    );
    console.assert(
        getCol([[],[],[]], 0)                                  == ",,"
    );
};

var testRemoveEmpty = function() {
    console.assert(removeEmpty([0,1,2,52,52],52) == "0,1,2");
    console.assert(removeEmpty([4,2,1,52,5],52) == "1,2,4,5");
    console.assert(removeEmpty([4,5,6,7,8],52) == "4,5,6,7,8");
    console.assert(removeEmpty([6,1,3,2,0],52) == "0,1,2,3,6");
    console.assert(removeEmpty([0,1,2,3,4],2) == "0,1");
    console.assert(removeEmpty([8,3,6,2,49],2) == "");
    console.assert(removeEmpty([],4) == "");
};

var testGetCardName = function() {
    console.assert(getCardName(0)  == "AC");
    console.assert(getCardName(4)  == "2C");
    console.assert(getCardName(28) == "8C");
    console.assert(getCardName(36) == "10C");
    console.assert(getCardName(9)  == "3S");
    console.assert(getCardName(21) == "6S");
    console.assert(getCardName(25) == "7S");
    console.assert(getCardName(41) == "JS");
    console.assert(getCardName(14) == "4H");
    console.assert(getCardName(18) == "5H");
    console.assert(getCardName(38) == "10H");
    console.assert(getCardName(46) == "QH");
    console.assert(getCardName(3)  == "AD");
    console.assert(getCardName(27) == "7D");
    console.assert(getCardName(35) == "9D");
    console.assert(getCardName(51) == "KD");
    console.assert(getCardName(52) == "empty");
    console.assert(getCardName(53) == "back");
    console.assert(getCardName(-1) == "");
    console.assert(getCardName(60) == "");
};

var testGetCardNum = function() {
    console.assert(getCardNum("documents/cards/AH.svg")            == 2);
    console.assert(getCardNum("test/3S.svg")                       == 9);
    console.assert(getCardNum("<img src='cards/8D.svg'>")          == 31);
    console.assert(getCardNum("KC.svg")                            == 48);
    console.assert(getCardNum("c:/users/cards/RedJoker.svg")       == -1);
    console.assert(getCardNum("BlackJoker.svg")                    == -1);
    console.assert(getCardNum("tp2/documents/cards/empty.svg")     == 52);
    console.assert(getCardNum("Prog/tp2/documents/cards/back.svg") == 53);
    console.assert(getCardNum("memes/pepe.svg")                    == -1);
    console.assert(getCardNum("")                                  == -1);
};

var testCalScore = function() {
    console.assert(calScore([0,36,40,44,48])  == 100);
    console.assert(calScore([1,37,41,45,49])  == 100);
    console.assert(calScore([7,11,15,19,23])  == 75);
    console.assert(calScore([10,14,18,22,26]) == 75);
    console.assert(calScore([8,9,10,11,39])   == 50);
    console.assert(calScore([1,32,33,34,35])  == 50);
    console.assert(calScore([20,21,22,23])    == 50);
    console.assert(calScore([12,13,37,38,39]) == 25);
    console.assert(calScore([41,42,43,22,23]) == 25);
    console.assert(calScore([4,20,28,40,44])  == 20);
    console.assert(calScore([13,21,25,29,33]) == 20);
    console.assert(calScore([11,19,31,35,39]) == 20);
    console.assert(calScore([4,20,28,40,44])  == 20);
    console.assert(calScore([3,7,43,47,51])   == 20);
    console.assert(calScore([1,5,9,45,49])    == 20);
    console.assert(calScore([0,37,40,45,49])  == 15);
    console.assert(calScore([34,37,40,45,49]) == 15);
    console.assert(calScore([10,12,19,21,25]) == 15);
    console.assert(calScore([3,5,10,15,16])   == 15);
    console.assert(calScore([0,1,2,15,16])    == 10);
    console.assert(calScore([8,21,22,23,47])  == 10);
    console.assert(calScore([3,27,40,41,42])  == 10);
    console.assert(calScore([33,34,35,46])    == 10);
    console.assert(calScore([1,5,6,7])        == 10);
    console.assert(calScore([12,13,14])       == 10);
    console.assert(calScore([16,17,30,31,51]) == 5);
    console.assert(calScore([10,11,14,37,39]) == 5);
    console.assert(calScore([28,36,39,46,47]) == 5);
    console.assert(calScore([21,23,48,49])    == 5);
    console.assert(calScore([9,10,12,14])     == 5);
    console.assert(calScore([24,27,32,38,43]) == 2);
    console.assert(calScore([3,9,11,25,34])   == 2);
    console.assert(calScore([19,20,29,30,46]) == 2);
    console.assert(calScore([5,10,12,50,51])  == 2);
    console.assert(calScore([13,14,32,41])    == 2);
    console.assert(calScore([15,28,31,43])    == 2);
    console.assert(calScore([0,5,16,17])      == 2);
    console.assert(calScore([0,3,39])         == 2);
    console.assert(calScore([21,41,43])       == 2);
    console.assert(calScore([29,30])          == 2);
    console.assert(calScore([0,7,40,44,48])   == 0);
    console.assert(calScore([2,5,9,46,51])    == 0);
    console.assert(calScore([6,12,21,34,41])  == 0);
    console.assert(calScore([3,15,29,32])     == 0);
    console.assert(calScore([27,29,35,48])    == 0);
    console.assert(calScore([17,33,41,45])    == 0);
    console.assert(calScore([18,22,26,30])    == 0);
    console.assert(calScore([9,18,43])        == 0);
    console.assert(calScore([5,10,12])        == 0);
    console.assert(calScore([13,25,29])       == 0);
    console.assert(calScore([19,23,27])       == 0);
    console.assert(calScore([4,47])           == 0);
    console.assert(calScore([21,27])          == 0);
    console.assert(calScore([13,33])          == 0);
    console.assert(calScore([2,6])            == 0);
    console.assert(calScore([1])              == 0);
    console.assert(calScore([35])             == 0);
    console.assert(calScore([])               == 0);
};

//Comment the desired test procedures to disable unit tests
testIota();
testMerge();
testSort();
testIndexToCoords();
testGetCol();
testRemoveEmpty();
testGetCardName();
testGetCardNum();
testCalScore();