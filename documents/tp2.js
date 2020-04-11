/*
TODO
    Unit tests.
    Make sure it behaves like the professor's.
    Comment the score calculation logic.
*/

///////////////////////////////////////////////////////////////////////////////
//Constants
///////////////////////////////////////////////////////////////////////////////

//Ids for special cards
var backCard = 53;
var emptyCard = 52;

//Cell number of the cell containing the deck of cards
var deckCell = 66;

///////////////////////////////////////////////////////////////////////////////
//Global variables
///////////////////////////////////////////////////////////////////////////////

//Integer representing the index of the next card to be drawn
var drawnCard = null;
//Flag (boolean) indicating if there is a drawn card on top of the deck
var cardIsDrawn = false;

//String containing the id of the selected card
var selectedCard = null;
//String containing the id of the selected cell
var selectedCell = null;

//Array of integer representing the deck of cards
var deck = [];

//Matrix of integer containing the content of the gameboard
var gameboardContent = [];

//Integer containing the total score
var totalScore = 0;

///////////////////////////////////////////////////////////////////////////////
//Functions
///////////////////////////////////////////////////////////////////////////////

//Builds the UI and initializes the global variables.
var init = function () {

    drawnCard = 0;
    cardIsDrawn = false;

    selectedCard = null;
    selectedCell = null;

    gameboardContent = squareMatrix(5, emptyCard);

    //Create and shuffle a deck of 52 cards
    deck = iota(52);
    shuffle(deck);    

    buildUI();
};

/*
Makes a square matrix of dimension n containing value.
Takes n, integer representing the matrix dimension
      value, object with what is filled the matrix.
*/
var squareMatrix = function(n, value){

    //Contains the resulting matrix, initialized with an array of n rows
    var matrix =  Array(n).fill(0);

    //Add n elements to each row
    matrix = matrix.map(function(x){
        return Array(n).fill(value);
    });

    return matrix;
};

/*
Makes an array containing n elements ranging from 0 to n-1.
Takes n, integer representing the array's length.
*/
var iota = function(n) {

    var table = Array(n).fill(n - 1).map(function(x, i){
        return x - i;
    });

    return table;

};

/*
Shuffles the deck of card in-situ.
Takes deck, an array.
*/
var shuffle = function(deck){

    for(var i = deck.length - 1; i > 0; i--){

        //Get a random card between the beggining and i
        var randI = Math.floor(Math.random() * Math.floor(i));

        //Place that card to the end of the deck, 
        //it will not be considered to the next iteration
        deck[i] = deck.splice(randI, 1, deck[i])[0];
    }
};

/*
Returns a string representing the code for a gameboard of dimensions 
width * height.
Takes height, integer.
      width, integer.
*/
var buildGameboard = function(height, width){

    //String containing the eventual gameboard
    var str = "";

    //For every row
    for (var i = 0; i < height; i++) {

        str += '<tr>';

        //For every cell of that row
        for (var j = 0; j < width; j++) {

            //Id determined by the row and column, like in a matrix
            var id = ("" + (i+1)) + (j+1) + emptyCard;

            //Add the cell that has that id
            str += '\
                <td id="'+id+'" onclick="clic('+id+');">\
                    <img src="cards/'+codeFromId(emptyCard)+'.svg">\
                </td>';
        }

        //Add the left column containing the score
        str += '<td id="'+(i+1)+(width+1)+'"></td>';
        str += '</tr>';
    }

    str += '<tr>';

    //Add the last row containing the score
    for (var j = 0; j < width; j++) {
        str += '<td id="'+(height+1)+(j+1)+'"></td>';
    }

    //Add the score cell containing the score
    str += '<td id="score">0</td></tr>';

    return str;
};

/*
Builds a string representing the UI in HTML and appends it to the body.
*/
var buildUI = function(){

    //Add the "Nouvelle partie" button, the deck cell 
    //and the empty table for the gameboard
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
                        onclick="clic('+deckCell+drawnCard+');"> \
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

    //Fill the empty table with a gameboard
    document.getElementById("gameboard").innerHTML = buildGameboard(5, 5);
};

/*
Obtains a card's code from its id.
Takes id, integer representing the card's id.
Returns a string representing its code.
*/
var codeFromId = function(id){

    //Special cases for empty and back card
    if(id == emptyCard){
        return "empty";
    }
    else if(id == backCard){
        return "back";
    }

    //String representing the value of the card
    var value = getValue(id);
    //String representing the type of the card
    var type = getType(id);

    //For the cards described by a letter and not a number
    switch(value){
        case 1: value = 'A'; break;
        case 11: value = 'J'; break;
        case 12: value = 'Q'; break;
        case 13: value = 'K'; break;
    }

    //Get the type as a letter from the obtained type number
    switch(type){
        case 0: type = 'C'; break;
        case 1: type = 'D'; break;
        case 2: type = 'H'; break;
        case 3: type = 'S'; break;
    }

    return value + type;
};

/*
Gives the numerical value of a card.
Takes cardId, integer representing the card's id.
Returns an integer representing its numerical value.
*/
var getValue = function(cardId){
    return Math.floor(cardId / 4) + 1;
};

/*
Gives the type of a card.
Takes cardId, integer representing the card's id.
Returns an integer from 0 to 3 representing its type.
*/
var getType = function(cardId){
    return cardId % 4;
};

/*
Alerts the user with its score and restarts a new game by 
calling the init function.
*/
var endGame = function(){
    window.alert("Votre pointage final est- " + totalScore);
    init();
};

/*
Returns the id of the card contained in a cell.
Takes cellId, string that is the cell's id.
*/
/*
Note that cell ids are strings of the following format:
"3241",
where 32 is the cell number (3rd row and 2nd column)
and 41 is the card id (41th card of the shuffled deck).
*/
var getCardId = function(cellId){
    return ("" + cellId).slice(2);
};

/*
Returns the number of a cell.
Takes cellId, string that is the cell's id.
*/
var getCellNum = function(cellId){
    return ("" + cellId).slice(0,2);
};

/*
Checks whether the cell is the deck of card or not.
Takes cellId, a string representing the cell's id.
Returns a boolean indicating if the cell is the deck's cell.
*/
var isDeck = function(cellId){
    return getCellNum(cellId) == deckCell;
};

/*
Tells whether a cell is empty or not.
Takes cellId, a string representing the cell's id.
Returns a boolean indicating whether the cell is empty or not.
*/
var isEmpty = function(cellId){
    return getCardId(cellId) == emptyCard;
};

/*
Selects a cell and card according to the cell id and card id parameters.
Takes cellId, string representing the id of the cell to select.
      cardId, string representing the id of the card to select.
*/
var selectCell = function(cellId, cardId){
    var cell = document.getElementById(cellId);

    //Update the background color
    cell.style.backgroundColor = "lime";

    selectedCard = cardId;
    selectedCell = cellId;
};

/*
If a card is selected, unselects the card.
*/
var unselectCell = function(){

    if(selectedCard != null){

        var cell = document.getElementById(selectedCell);

        //Update the background color
        cell.style.backgroundColor = "transparent";

        selectedCard = null;
        selectedCell = null;
    }  
};

/*
Updates a cell according to parameters.
Takes cellId, the id of the cell to be updated.
      newCardId, the id of the cell's new card.
      isSelectedCell, boolean indicating if the cell 
        will become selected after the update.
      toggleScoreCalculation a boolean indicating if it is relevant to
        calculate the score after the update.
*/
var updateCell = function(cellId, 
                          newCardId, 
                          isSelectedCell, 
                          toggleScoreCalculation){
    var cell = document.getElementById(cellId);

    //Change the cell's id.
    cell.id = getCellNum(cellId) + newCardId;
    cellId = cell.id;

    //Change the cell's onclick function.
    cell.onclick = function(){clic(cellId);};

    //Change the cell's image. (the card)
    cell.innerHTML = '<img src="cards/'+ codeFromId(newCardId) +'.svg">';

    if(isSelectedCell){
        selectCell(cellId, newCardId);
    }

    updateGameboardContent(cellId);

    if(toggleScoreCalculation){
        calculateScore();
    }
};

/*
Draws a card from the deck.
Takes cellId the deck's cell id.
*/
var draw = function(cellId){
    var cell = document.getElementById(cellId);
    cell.innerHTML = '<img src="cards/'+ codeFromId(deck[drawnCard]) +'.svg">';
    cardIsDrawn = true;
};

/*
Prepares the deck of card so it is ready to display the next card.
Takes cellId the deck's cell id.
Returns the state of cardIsDrawn.
*/
var initDeck = function(cellId){
    var cell = document.getElementById(cellId);

    //DrawnCard is the next card.
    drawnCard++;

    //Check if the drawn card exceeds the gameboard's capacity.
    //(game over)
    if(drawnCard >= 25){
        cell.innerHTML = '<img src="cards/'+codeFromId(emptyCard)+'.svg">';
        cardIsDrawn = true;
    }
    else{
        cell.innerHTML = '<img src="cards/'+codeFromId(backCard)+'.svg">';
        cardIsDrawn = false;
    }
    
    return cardIsDrawn;
};

/*
Manages the click of a cell.
Takes cellId, the clicked cell's id.
*/
var clic = function(cellId){

    //If the clicked cell is the deck
    if(isDeck(cellId)){

        //Keep a backup of the previously selected cell
        var bkp = selectedCell;

        unselectCell();

        //Draw a card if needed
        if(!cardIsDrawn){
            draw(cellId);
        }

        //Select the card on top of the deck if it is not already
        //selected or if we have no card in hand
        if(bkp == null || !isDeck(bkp)){

            //Select the card on top of the deck
            selectCell(cellId, deck[drawnCard]);
        }
    }
    //Clicking on a non-empty gameboard cell without any selected card in hand
    else if(selectedCard == null && !isEmpty(cellId)){

        //Select the cell that is clicked
        selectCell(cellId, getCardId(cellId));
    }
    else{
        //Taking a card from the deck to an empty cell
        if(isDeck(selectedCell) && isEmpty(cellId)){

            //Insert the card in the clicked cell and make sure 
            //it is still not the end of the game
            var end = initDeck(selectedCell);
            updateCell(cellId, selectedCard, false, true);
            unselectCell();
            if(end){
                endGame();
            }
        }
        //Taking a card from the deck to a non-empty cell
        else if(isDeck(selectedCell)){
            
            //Take in hand the card of the clicked cell instead
            unselectCell();
            selectCell(cellId, getCardId(cellId));
        }
        //Exchanging two cards
        else if(selectedCell != null && !isEmpty(selectedCell)){

            //Exchange the card in hand with the one we are clicking on
            var cardId = getCardId(cellId);//keep a backup
            updateCell(cellId, selectedCard);
            updateCell(selectedCell, cardId, true, true);
            unselectCell();
        }
    }
};

/*
Updates the gameboardContent matrix with a new cell.
Takes cellId, the id of the new cell.
*/
var updateGameboardContent = function(cellId){
    var cell = document.getElementById(cellId);

    //Get the cell's information
    var cellNum = getCellNum(cellId);
    var cardId = +getCardId(cellId);

    //Update the right cell with the right card.
    gameboardContent[cellNum[0] - 1][cellNum[1] - 1] = cardId;
};

///////////////////////////////////////////////////////////////////////////////
//TO DO: comment that section
//       refine it
///////////////////////////////////////////////////////////////////////////////

var calculateScore = function(){
    totalScore = 0;
    gameboardContent.forEach(function(hand, i){
        var score = handScore(hand);
        totalScore += +score;
        var cellId = i + 1 + "6";
        document.getElementById(cellId).innerHTML = score;
    });
    transpose(gameboardContent).forEach(function(hand, i){
        var score = handScore(hand);
        totalScore += +score;
        var cellId = "6" + (i + 1);
        document.getElementById(cellId).innerHTML = score;
    });
    document.getElementById("score").innerHTML = totalScore;
};

var transpose = function(matrix){
    var matrixT = Array(matrix[0].length).fill(0);
    matrixT = matrixT.map(function(x){
        return Array(matrix.length).fill(emptyCard);
    });
    for(var i = 0; i < matrix.length; i++){
        for(var j = 0; j < matrix[i].length; j++){
            matrixT[j][i] = matrix[i][j];
        }
    }
    return matrixT;
};

var handScore = function(hand){
    var result = 0;
    var score = 0;

    var values = valuesFrom(hand);
    var types = typesFrom(hand);

    var cpy = copy(values);
    removeEmpty(cpy);
    score = evaluate(fullHouseAndLess(cpy, ""));

    result = quinteFlush(values, types);
    if(result > score){
        score = result;
    }

    if(score <= 0){
        score = "";
    }
    return score;
};

var quinteFlush = function(cards, types){
    var score = 0;
    trier(cards);
    var streak = 1;
    var royale = cards[0] == 1 && cards[cards.length - 1] == 13;

    for (var i = 1; i < cards.length; i++) {
        if(cards[i] - cards[i - 1] == 1 || (royale && i == 1)){
            streak++;
        }
        else{
            streak = 0;
        }
    }
    var isFlush = flush(types) == 20;
    if(streak == 5 && isFlush && royale){
        score = 100;
    }
    if(streak == 5 && isFlush){
        score = 75;
    }
    if(isFlush){
        score = 20;
    }
    if(streak == 5){
        score =  15;
    }
    return score;
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
    var score = 0;
    if(result == "4"){//CARRE
        score = 50;
    }
    else if(result == "32" || result == "23"){//FULL HOUSE
        score = 25;
    }
    else if(result == "3"){//BRELAN
        score = 10;
    }
    else if(result == "22"){//DOUBLE PAIR
        score = 5;
    }
    else if(result == "2"){//PAIR
        score = 2;
    }
    return score;
};

var copy = function(array){
    return array.slice();
};

var removeEmpty = function(hand){
    var i = hand.indexOf(+emptyCard);
    while(i >= 0){
        hand.splice(i, 1);
        i = hand.indexOf(+emptyCard);
    }
};

var valuesFrom = function(cards){
    var values = copy(cards);

    values = values.map(function(card){
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

///////////////////////////////////////////////////////////////////////////////
//Tests
///////////////////////////////////////////////////////////////////////////////

var testHands = function(){
    console.log(handScore([ 2, 37, 31, 44, 23 ]) == 0);  //Nothing

    console.log(handScore([ 39, 51, 43, 47, 3 ]) == 100);//Quinte Flush Royale

    console.log(handScore([ 0, 4, 8, 12, 16 ]) == 75);   //Quinte Flush
    console.log(handScore([ 2, 6, 14, 10, 18 ]) == 75);  //With ace at the end

    console.log(handScore([ 0, 2, 43, 1, 3 ]) == 50);    //Carré

    console.log(handScore([ 0, 2, 43, 42, 3 ]) == 25);   //FullHouse

    console.log(handScore([ 0, 48, 24, 28, 36 ]) == 20); //Flush

    console.log(handScore([ 21, 25, 17, 14, 28 ]) == 15);//Quinte
    console.log(handScore([ 49, 3, 39, 40, 47 ]) == 15); //With ace at the end
    console.log(handScore([ 2, 7, 13, 11, 18 ]) == 15);  //With ace at the beggining

    console.log(handScore([ 6, 7, 17, 5, 28 ]) == 10);   //Brelan

    console.log(handScore([ 6, 7, 17, 19, 28 ]) == 5);//Double paire

    console.log(handScore([ 6, 7, 17, 43, 28 ]) == 2);//Paire
};

///////////////////////////////////////////////////////////////////////////////
//Extrait des notes de cours de Monsieur Marc Feeley, 
//du cours IFT1015 à la session d'hiver 2020.
///////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////






