//Constants
var backCardCode = 53;
var emptyCardCode = 52;
var deckLength = 52;
var deckCode = 66;
var hCellCount = 5;
var vCellCount = 5;

//Variables
var currentCard = null;
var selectedCard = null;
var selectedCell = null;
var deckReady = false;

var deck = [];


//Returns an array containing n elements ranging from 0 to n-1
var iota = function(n) {
    if(Math.floor(n) == n && n >= 0){
        table = Array(n);
        for (var i = 0; i < table.length; i++) {
            table[i] = i;
        }
    }
    return table;
};

//Shuffles the deck of cards
var shuffle = function(deck){

    for(var i = deck.length - 1; i > 0; i--){

        //Get a random card from the cards among the beggining to the current index
        var randI = Math.floor(Math.random() * Math.floor(i));

        //Put the choosen random card to the end of the deck so it will not be considered as a potential random card anymore
        deck[i] = deck.splice(randI, 1, deck[i])[0];
    }
};

//Get the card code from its id
var codeFromId = function(id){

    if(id == emptyCardCode){
        return "empty";
    }

    var value = Math.floor(id / 4) + 1;
    var type = id % 4;

    switch(value){
        case 1: value = 'A'; break;
        case 11: value = 'J'; break;
        case 12: value = 'Q'; break;
        case 13: value = 'K'; break; 
    }

    switch(type){
        case 0: type = 'C'; break;
        case 1: type = 'D'; break;
        case 2: type = 'H'; break;
        case 3: type = 'S'; break;
    }

    return value + type;
};

//Builds a string representing the html code of the gameboard
var buildGameboard = function(){
    var gbStr = "";

    for (var i = 0; i < vCellCount; i++) {
        gbStr += '<tr>';
        for (var j = 0; j < hCellCount; j++) {
            var id = ("" + (i+1)) + (j+1) + emptyCardCode;
            gbStr += '<td id="'+id+'" onclick="clic('+id+');"><img src="cards/empty.svg"></td>';
        }
        gbStr += '<td id="'+(i+1)+(vCellCount+1)+'"></td>';
        gbStr += '</tr>';
    }

    gbStr += '<tr>';
    for (var j = 0; j < hCellCount; j++) {
        gbStr += '<td id="'+(vCellCount+1)+(j+1)+'"></td>';
    }
    gbStr += '<td id="score">0</td></tr>';

    return gbStr;
};

//Builds the UI
var buildUI = function(){
    document.getElementById("b").innerHTML = '\
        <table>\
        <tbody>\
        <tr>\
        <td>\
        <button onclick="init();" style="float:left;">Nouvelle partie</button>\
        </td>\
        <td></td>\
        <td id="'+deckCode+currentCard+'" onclick="clic('+deckCode+currentCard+');"style="background-color: transparent;">\
        <img src="cards/back.svg">\
        </td>\
        <td></td>\
        </tr>\
        <div></div>\
        </tbody>\
        </table>\
        <table>\
        <tbody id="gameboard">\
        </tbody>\
        </table>\
        '
    document.getElementById("gameboard").innerHTML = buildGameboard();
};

//Called on page load
var init = function () {
    selectedCard = null;
    selectedCell = null;

    deckReady = false;

    //Create a deck of 52 cards
    deck = iota(deckLength);

    shuffle(deck);

    currentCard = 0;

    buildUI();
};

//Ends the current game by reseting the UI and game progress
var endGame = function(){
    window.alert("Game Over");
    init();
};

var selectCell = function(cellId, cardId){
    var cell = document.getElementById(cellId);
    cell.style.backgroundColor = "lime";
    selectedCard = cardId;
    selectedCell = cellId;
};

var unselectCell = function(){
    if(selectedCard != null){
        console.log(selectedCard + ", " + selectedCell);
        var cell = document.getElementById(selectedCell);
        cell.style.backgroundColor = "transparent";
        selectedCard = null;
        selectedCell = null;
    }
    
};

var getCardId = function(cellId){
    return ("" + cellId).slice(2);
};

var getCellNum = function(cellId){
    return ("" + cellId).slice(0,2);
};

var isDeck = function(cellId){
    return getCellNum(cellId) == deckCode;
};

var draw = function(cellId){
    var cell = document.getElementById(cellId);
    cell.innerHTML = '<img src="cards/'+ codeFromId(deck[currentCard]) +'.svg">';
    deckReady = true;
};

var reinitDeck = function(cellId){
    var cell = document.getElementById(cellId);
    currentCard++;
    if(currentCard >= hCellCount * vCellCount){
        cell.innerHTML = '<img src="cards/empty.svg">';
        return true;
    }
    else{
        cell.innerHTML = '<img src="cards/back.svg">';
        deckReady = false;
    }
    
    return false;
};  

var isEmpty = function(cellId){
    return getCardId(cellId) == emptyCardCode;
};

var updateCell = function(cellId, cardId, isSelectedCell){
    var cell = document.getElementById(cellId);
    cell.id = getCellNum(cellId) + cardId;
    cell.onclick = function(){clic(cell.id);};
    cell.innerHTML = '<img src="cards/'+ codeFromId(cardId) +'.svg">';
    if(isSelectedCell){
        selectCell(cell.id, cardId);
    }
};

var updateScore = function(){
    //TO DO: system to update the score
};

//Manages the click of a card or card cell
var clic = function(cellId){
    if(isDeck(cellId)){
        if(selectedCard == null && !deckReady){
            draw(cellId);
            selectCell(cellId, deck[currentCard]);
        }
        else if(selectedCard == null && deckReady){
            selectCell(cellId, deck[currentCard]);
        }
        else{
            unselectCell();
        }
    }
    else if(selectedCard == null){
        selectCell(cellId, getCardId(cellId));
    }
    else{
        if(isDeck(selectedCell) && isEmpty(cellId)){
            var end = reinitDeck(selectedCell);
            updateCell(cellId, selectedCard);
            unselectCell();
            if(end){
                endGame();
            }
        }
        else if(isDeck(selectedCell)){
            unselectCell();
            selectCell(cellId, getCardId(cellId));
        }
        else{
            var cardId = getCardId(cellId);//keep a backup
            updateCell(cellId, selectedCard);
            updateCell(selectedCell, cardId, true);
            unselectCell();
        }
    }

    updateScore();

};