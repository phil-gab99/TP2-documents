//Constants
var backCardCode = 53;
var emptyCardCode = 52;
var deckLength = 52;

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
var cardFromId = function(id){
    var number = Math.floor(id / 4) + 1;
    var type = id % 4;

    switch(number){
        case 1: number = 'A'; break;
        case 11: number = 'J'; break;
        case 12: number = 'Q'; break;
        case 13: number = 'K'; break; 
    }

    switch(type){
        case 0: type = 'C'; break;
        case 1: type = 'D'; break;
        case 2: type = 'H'; break;
        case 3: type = 'S'; break;
    }

    return number + type;
};

//Builds a string representing the html code of the gameboard
var buildGameboard = function(){
    var gbStr = "";

    for (var i = 0; i < 5; i++) {
        gbStr += '<tr>';
        for (var j = 0; j < 5; j++) {
            var id = ("" + (i+1)) + (j+1)+"99";
            gbStr += '<td id="'+id+'" onclick="clic('+id+');"><img src="cards/empty.svg"></td>';
        }
        gbStr += '<td></td>';
        gbStr += '</tr>';
    }

    gbStr += '<tr>';
    for (var j = 0; j < 5; j++) {
        gbStr += '<td></td>';
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
        <td id="'+backCardCode+currentCard+'" onclick="clic('+backCardCode+currentCard+');"style="background-color: transparent;">\
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

var selectCell = function(cell, card){
    cell.style.backgroundColor = "lime";
    selectedCard = card;
    selectedCell = cell;
};

var unselectCell = function(){
    if(selectedCard != null){
        selectedCell.style.backgroundColor = "transparent";
        selectedCard = null;
        selectedCell = null;
    }
    
};

var cardIdFromCellId = function(cellId){
    return ("" + cellId).slice(2);
};

var cellNumFromCellId = function(cellId){
    return ("" + cellId).slice(0,2);
};

//Manages the click of a card or card cell
var clic = function(cellId){
    var cell = document.getElementById(cellId);
    var cardId = cardIdFromCellId(cellId);
    var cellNum = cellNumFromCellId(cellId);

    //Clicking the deck when it is not ready
    if(cellNum == backCardCode && selectedCard == null && !deckReady){
        //Adjust the deck's image to the currentCard
        cell.innerHTML = '<img src="cards/'+ cardFromId(deck[currentCard]) +'.svg">';

        selectCell(cell, deck[currentCard]);

        deckReady = true;
    }
    //Clicking the deck when it is ready with no card in hand
    else if(cellNum == backCardCode && selectedCard == null && deckReady){
        selectCell(cell, deck[currentCard]);
    }
    //Clicking the deck with a card in hand
    else if(cellNum == backCardCode && selectedCard != null){
        unselectCell();
    }
    //Clicking an empty cell with a selected card in hand
    else if(cellNum != backCardCode && selectedCard != null){
        cell.innerHTML = '<img src="cards/'+ cardFromId(selectedCard) +'.svg">';

        cell.id = cellNum + selectedCard;
        cell.onclick = function(){clic(cell.id);};

        //If the selected card is from the deck cell and current cell is empty
        if(cellNumFromCellId(selectedCell.id) == backCardCode && cardId == "99"){
            selectedCell.innerHTML = '<img src="cards/back.svg">';
            currentCard++;
            deckReady = false;
            if(currentCard >= deckLength){
                document.getElementById(backCardCode).innerHTML = '<img src="cards/empty.svg">';
                endGame();
            }
        }
        //If the selected card is from the deck cell and current cell is not empty
        else if(cellNumFromCellId(selectedCell.id)){
            //selectCell(cell, cardId);
        }
        //Otherwise exchange the current's cell card with the selected cell
        else{
            var cpy = document.getElementById(selectedCell.id);
            if(cardId == "99"){
                cpy.innerHTML = '<img src="cards/empty.svg">';
                cpy.id = cellNumFromCellId(selectedCell.id) + "99";
            }
            else{
                cpy.innerHTML = '<img src="cards/'+cardFromId(cardId)+'.svg">';
                cpy.id = cellNumFromCellId(selectedCell.id) + "" + cardId;
            }

            cpy.onclick = function(){clic(cpy.id);};

            cell.innerHTML = '<img src="cards/'+cardFromId(selectedCard)+'.svg">';
        }
        unselectCell();


    }
    else if(cellNum != backCardCode && selectedCard == null){
        selectCell(cell, cardId);
    }
    // else{
    //     //console.log(selectedCard + cardId);
    //     //var card = deck[cardId];
    //     if(selectedCard == null && cardId != "00"){
    //         console.log("allo");
    //         selectedCard = cardId;
    //         selectedCell = cell;
    //         cell.style.backgroundColor = "lime";
    //     }
    //     else if(selectedCard != null && cardId == "00"){
    //         console.log(cardId);
    //         selectedCell.style.backgroundColor = "transparent";
    //         cell.innerHTML = '<img src="cards/'+cardFromId(card)+'.svg">';
    //     }
    // }
};