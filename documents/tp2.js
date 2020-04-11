//Constants
var backCard = 53;
var emptyCard = 52;

var deckCell = 66;

var boardWidth = 5;
var boardHeight = 5;
var deckLength = 52;

var selectedColor = "lime";
var unselectedColor = "transparent";

//Variables

//Represents the index (in the deck array) of the card that is to be drawn next
var drawnCard = null;
//Indicates whether their is a drawn card on top of the deck, 
//or if it's the back of the card.
var cardIsDrawn = false;
//Variables to save the clicked (selected) card and cell.
var selectedCard = null;
var selectedCell = null;
//Contains the deck of card.
var deck = [];
//Contains the gameboard as a matrix.
var gameboardContent = [];

//Returns an array containing n elements ranging from 0 to n-1
//Takes n, an integer representing the array's length.
var iota = function(n) {
    var table = Array(n).fill(n - 1).map(function(x, i){
        return x - i;
    });
    return table;

};

//Shuffles the deck of cards (in-situ)
//Takes deck, an array representing a deck of cards.
var shuffle = function(deck){
    for(var i = deck.length - 1; i > 0; i--){
        //Get a random card from the cards among the beggining to the current index.
        var randI = Math.floor(Math.random() * Math.floor(i));

        //Put the choosen random card to the end of the deck.
        //so it will not be considered as a potential random card anymore.
        deck[i] = deck.splice(randI, 1, deck[i])[0];
    }
};

//Get the card code from its id.
//Takes id, an integer representing a card's id.
//Returns a string representing its code.
var codeFromId = function(id){

    //Special cases for some specific ids.
    if(id == emptyCard){
        return "empty";
    }
    else if(id == backCard){
        return "back";
    }

    //Contains a string representing the value of the card (number or letter).
    var value = getValue(id);
    //Contains a string representing the type of the card.
    var type = getType(id);

    //For the cards described by a letter and not a number.
    switch(value){
        case 1: value = 'A'; break;
        case 11: value = 'J'; break;
        case 12: value = 'Q'; break;
        case 13: value = 'K'; break;
    }

    //Get the type letter from the obtained number.
    switch(type){
        case 0: type = 'C'; break;
        case 1: type = 'D'; break;
        case 2: type = 'H'; break;
        case 3: type = 'S'; break;
    }

    return value + type;
};

//Gives the numerical value of a card
//Takes cardId, an integer representing a card's id.
//Returns an integer representing its numerical value.
var getValue = function(cardId){
    return Math.floor(cardId / 4) + 1;
};

//Gives the type of a card
//Takes cardId, an integer representing a card's id.
//Returns an integer representing its numerical value.
var getType = function(cardId){
    return cardId % 4;
};

//Builds a string representing the html code of the gameboard.
var buildGameboard = function(){
    var boardString = "";

    //For every row
    for (var i = 0; i < boardHeight; i++) {
        boardString += '<tr>';

        //For every cell of that row.
        for (var j = 0; j < boardWidth; j++) {
            //Id determined by the row and column, like in a matrix.
            var id = ("" + (i+1)) + (j+1) + emptyCard;

            //Add the cell.
            boardString += '\
                <td id="'+id+'" onclick="clic('+id+');">\
                    <img src="cards/'+codeFromId(emptyCard)+'.svg">\
                </td>';
        }

        //The left column representing the rows' points.
        boardString += '<td id="'+(i+1)+(boardWidth+1)+'"></td>';
        boardString += '</tr>';
    }

    boardString += '<tr>';

    //The last row representing the columns' points.
    for (var j = 0; j < boardWidth; j++) {
        boardString += '<td id="'+(boardHeight+1)+(j+1)+'"></td>';
    }

    //The score cell.
    boardString += '<td id="score">0</td></tr>';

    return boardString;
};

//Builds the UI (The new game button and the deck, then adds the gameboard).
var buildUI = function(){
    document.getElementById("b").innerHTML = '\
        <table>\
            <tbody>\
                <tr>\
                    <td>\
                        <button onclick="init();" style="float:left;">\
                            Nouvelle partie\
                        </button>\
                    </td>\
                    <td></td>\
                    <td id="'+deckCell+drawnCard+'" \
                        onclick="clic('+deckCell+drawnCard+');" \
                        style="background-color:'+unselectedColor+'">\
                        <img src="cards/'+codeFromId(backCard)+'.svg">\
                    </td>\
                    <td></td>\
                </tr>\
                    <div></div>\
            </tbody>\
        </table>\
        <table>\
            <tbody id="gameboard"></tbody>\
        </table>'

    document.getElementById("gameboard").innerHTML = buildGameboard();
};

//Called onload.
var init = function () {

    //Initialize the value of the variables.
    var selectedCard = null;
    var selectedCell = null;
    var cardIsDrawn = false;

    //Make a matrix representing the gameboard's content, 
    //filled initially with empty cards.
    gameboardContent =  Array(boardHeight).fill(
                            Array(boardWidth).fill(emptyCard));

    //Create a deck of 52 cards.
    deck = iota(deckLength);

    //Shuffles it.
    shuffle(deck);

    //Set the drawn card to the first.
    drawnCard = 0;

    buildUI();
};

//Ends the current game by calling init again
///////////////////////////////////////////////////////////////////////////////
//TO DO: display the final score
///////////////////////////////////////////////////////////////////////////////
var endGame = function(){
    window.alert("Game Over");
    init();
};

//Selects a cell and card according to the id and card id passed as parameters.
//Takes cellId, a string representing the cell-to-select's id.
//      card Id, an integer representing the id of the card in that cell.
var selectCell = function(cellId, cardId){
    var cell = document.getElementById(cellId);
    cell.style.backgroundColor = selectedColor;
    selectedCard = cardId;
    selectedCell = cellId;
};

//Unselects the current selected cell and card if they are some selected.
var unselectCell = function(){
    if(selectedCard != null){
        var cell = document.getElementById(selectedCell);
        cell.style.backgroundColor = unselectedColor;
        selectedCard = null;
        selectedCell = null;
    }  
};

//Get a card's id from a cell id
//Takes cellId, a string representing the cell's id
///////////////////////////////////////////////////////////////////////////////
//Note that cell ids are strings of the following format:
//
//  3241
//
//  where 32 is the cell number (3rd row and 2nd column)
//  and 41 is the card id (41th card (element) of the shuffled deck (an array))
///////////////////////////////////////////////////////////////////////////////
//Returns the card's id as a string
var getCardId = function(cellId){
    return ("" + cellId).slice(2);
};

//Same logic that getCardId but to get the cell's number
var getCellNum = function(cellId){
    return ("" + cellId).slice(0,2);
};

//Check whether the cell specified by its id is the deck (the pile of card)
//Takes cellId, a string representing the cell's id
//Returns a boolean indicating if the cell is the deck's cell
var isDeckCell = function(cellId){
    return getCellNum(cellId) == deckCell;
};

//Tells whether a cell is empty or not.
//Takes cellId, a string representing the cell's id.
//Returns a boolean indicating whether the cell is empty or not.
var isEmpty = function(cellId){
    return getCardId(cellId) == emptyCard;
};

//Draws (display because we already know the next card) a card from the deck
//In other words, displays the next card of the shuffled deck.
//Takes cellId, the current cell id of the deck.
//(since a cell's id is modified by the card the cell contains)
var draw = function(cellId){
    var cell = document.getElementById(cellId);
    cell.innerHTML = '<img src="cards/'+ codeFromId(deck[drawnCard]) +'.svg">';
    cardIsDrawn = true;
};

//Reinitializes the deck of card to be ready to display the next card.
//Takes cellId, the current cell id of the deck.
//Returns the state of cardIsDrawn.
var initDeck = function(cellId){
    var cell = document.getElementById(cellId);

    //The drawn card is now the next one
    drawnCard++;

    //Check if the drawnCard exceeds the limit of the gameboard (game is over)
    if(drawnCard >= boardWidth * boardHeight){
        cell.innerHTML = '<img src="cards/'+codeFromId(emptyCard)+'.svg">';
        cardIsDrawn = true;
    }
    else{
        cell.innerHTML = '<img src="cards/'+codeFromId(backCard)+'.svg">';
        cardIsDrawn = false;
    }
    
    return cardIsDrawn;
};

//Updates a cell according the the parameters described below:
//Takes cellId, the cell-to-be-updated's id.
//      newCardId, the new-card-to-be-displayed's id.
//      isSelectedCell, a boolean indicating if the cell has 
//          to be selected after update.
//      toggleScoreCalculation, a boolean indicating if it is relevant to
//          calculate the score after update.
var updateCell = function(cellId, newCardId, isSelectedCell, toggleScoreCalculation){
    //Update the cell
    var cell = document.getElementById(cellId);
    cell.id = getCellNum(cellId) + newCardId;
    cellId = cell.id;
    cell.onclick = function(){clic(cellId);};
    cell.innerHTML = '<img src="cards/'+ codeFromId(newCardId) +'.svg">';

    if(isSelectedCell){
        selectCell(cellId, newCardId);
    }

    //Update the score
    updateScore(cellId);

    if(toggleScoreCalculation){
        calculateScore();
    }
};

//Manages the click of a cell.
//Takes cellId, the clicked cell's id.
///////////////////////////////////////////////////////////////////////////////
//TO DO: make sure it behaves exactly as the professor's program.
///////////////////////////////////////////////////////////////////////////////
var clic = function(cellId){
    //If it is the deck
    if(isDeckCell(cellId)){
        //If we have a card in hand
        if(selectedCard != null){
            //Cancel the card selection
            unselectCell();
        }
        //Otherwise if we have no card in hand
        else {
            //if the cell is not displaying any drawn card, draw one
            if(!cardIsDrawn){
                draw(cellId);
            }
            //Select the card on top of the deck
            selectCell(cellId, deck[drawnCard]);
        }
    }
    //If we have no card in hand and we are not clicking on the deck
    else if(selectedCard == null){
        //Select the cell that is clicked
        selectCell(cellId, getCardId(cellId));
    }
    //Otherwise, if we have a card in hand and we are not clicking on the deck
    else{
        //if the card we have is from the deck and the cell we click is empty
        if(isDeckCell(selectedCell) && isEmpty(cellId)){

            //Insert the card in the clicked cell and make sure 
            //it is still not the end of the game
            var end = initDeck(selectedCell);
            updateCell(cellId, selectedCard, false, true);
            unselectCell();
            if(end){
                endGame();
            }
        }
        //if the card we have is from the deck 
        //and the cell we click is NOT empty
        else if(isDeckCell(selectedCell)){
            //Take in hand the card of the clicked cell instead
            unselectCell();
            selectCell(cellId, getCardId(cellId));
        }
        //if the card we have is NOT from the deck 
        //and the cell we click is NOT empty
        else{
            //Exchange the card in hand with the one we are clicking on
            var cardId = getCardId(cellId);//keep a backup
            updateCell(cellId, selectedCard);
            updateCell(selectedCell, cardId, true, true);
            unselectCell();
        }
    }
};

var updateScore = function(cellId, calculateScore){
    var cell = document.getElementById(cellId);
    var cellNum = getCellNum(cellId);
    var cardId = +getCardId(cellId);
    gameboardContent[cellNum[0] - 1][cellNum[1] - 1] = cardId;
};

var calculateScore = function(){
    gameboardContent.forEach(function(hand, i){
        var score = handScore(hand);
        var cellId = i + 1 + "6";
        document.getElementById(cellId).innerHTML = score;
    });
};

var handScore = function(hand){
    var score = 0;

    var cpy = hand;
    var values = copy(valuesFrom(hand));
    //console.log("2: " + typesFrom(cpy));
    var types = copy(typesFrom(cpy));

    //console.log("Appel #" + (i+1));
    removeEmpty(values);
    score = evaluate(fullHouseAndLess(values, ""));

    

    if(score < 25){
        values = copy(valuesFrom(hand));

        var result = flush(types);
        if(result > score){
            score = result;
        }
        
        
        removeEmpty(values);
        result = quinte(values);
        if(result == 15 && flush(types) > 0){
            score = 75;
        }
        // if(result > score){
        //     score = result;
        //     result = flush(types);        
        //     if(result > 0){
        //         score = 75;
        //     }    
        // }
    }

    if(score <= 0){
        score = "";
    }
    return score;
};

var quinte = function(cards){
    trier(cards);
    var streak = 1;
    var isFlush = true;
    var aceAndKing = cards[0] == 1 && cards[cards.length - 1] == 13;

    for (var i = 1; i < cards.length; i++) {
        if(cards[i] - cards[i - 1] == 1 || (aceAndKing && i == 1)){
            streak++;
        }
        else{
            streak = 0;
        }
    }
    if(streak == 5){
        return 15;
    }
    return 0;
};

var flush = function(cards){
    var isFlush = true;
    for (var i = 1; i < cards.length; i++) {
        if(cards[i] == emptyCard || cards[i] - cards[i - 1] != 0){
            isFlush = false;
            break;
        }
    }
    if (isFlush) {
        return 20;
    }
    return 0;
};

///////////////////////////////////////////////////////////////////////

// Procédure qui trie un tableau en ordre croissant in-situ

var trier = function (t) {  // tri par sélection
    for (var i=0; i<t.length-1; i++) {
        var m = positionMin(t, i);
        var temp = t[i];
        t[i] = t[m];
        t[m] = temp;
    }
};

var positionMin = function (t, debut) {

    // suppose que t.length > debut

    var posMin = debut;

    for (var i=debut+1; i<t.length; i++) {
        if (t[i] < t[posMin]) {
            posMin = i;
        }
    }

    return posMin;
};

///////////////////////////////////////////////////////////////////////

var fullHouseAndLess = function(cards, result){
    let first = cards.shift();
    let i = cards.indexOf(first);
    let j = -1;
    let k = -1;
    if(i >= 0){
        j = cards.indexOf(first, i + 1);
        if(j >= 0){
            k = cards.indexOf(first, j + 1);
        }
    }
    if(i >= 0 && j >= 0 && k >= 0){
        cards.splice(j, 1);
        cards.splice(i, 1);
        cards.splice(k, 1);
        result += "4";
    }
    else if(i >= 0 && j >= 0){
        cards.splice(j, 1);
        cards.splice(i, 1);
        result += "3";
    }
    else if(i >= 0){
        cards.splice(i, 1);
        result += "2";
    }

    if(cards.length > 0){
        result = fullHouseAndLess(cards, result);
    }

    return result;
}

var evaluate = function(result){
    if(result == "4"){
        return 50;
    }
    else if(result == "32" || result == "23"){//FULL HOUSE
        return 25;
    }
    else if(result == "3"){//BRELAN
        return 10;
    }
    else if(result == "22"){//DOUBLE PAIR
        return 4;
    }
    else if(result == "2"){//PAIR
        return 2;
    }
    return 0;
};


// var findPairs = function(values, count){
//     // call++;
//     let first = values.shift();
//     let i = values.indexOf(first);
//     if(i >= 0){
//         values.splice(i, 1);
//         count++;
//         // console.log("2 x " + first + ", count = " + count);
//         // console.log("Call deepness: " + call);
//     }
//     if(values.length > 0){
//         count = findPairs(values, count);
//     }

//     return count;
// };

var copy = function(array){
    return array;
};

var removeEmpty = function(hand){
    var i = hand.indexOf(+emptyCard);
    while(i >= 0){
        hand.splice(i, 1);
        i = hand.indexOf(+emptyCard);
    }
};

var valuesFrom = function(cards){
    //console.log(cards);
    var values = cards.map(function(card){
        if(card != emptyCard){
            return getValue(card);
        }
        return emptyCard;
    });
    return values;
};

var typesFrom = function(cards){
     var types = cards.map(function(card){
        if(card != emptyCard){
            return getType(card);
        }
        return emptyCard;
    });
    return types;
};

//console.log(handScore([0,4,8,12,16]));

