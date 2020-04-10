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
var drawnCard = null;
var selectedCard = null;
var selectedCell = null;
var cardIsDrawn = false;

var deck = [];

var statusMatrix = [];

//Returns an array containing n elements ranging from 0 to n-1
var iota = function(n) {
    var table = Array(n).fill(n - 1).map(function(x, i){
        return x - i;
    });
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
    if(id == emptyCard){
        return "empty";
    }
    else if(id == backCard){
        return "back";
    }

    var value = getValue(id);
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
    var boardString = "";

    for (var i = 0; i < boardHeight; i++) {
        boardString += '<tr>';
        var row = [];
        for (var j = 0; j < boardWidth; j++) {
            var id = ("" + (i+1)) + (j+1) + emptyCard;
            boardString += '<td id="'+id+'" onclick="clic('+id+');"><img src="cards/'+codeFromId(emptyCard)+'.svg"></td>';
            row.push(emptyCard);
        }
        statusMatrix.push(row);
        boardString += '<td id="'+(i+1)+(boardWidth+1)+'"></td>';
        boardString += '</tr>';
    }

    boardString += '<tr>';
    for (var j = 0; j < boardWidth; j++) {
        boardString += '<td id="'+(boardHeight+1)+(j+1)+'"></td>';
    }
    boardString += '<td id="score">0</td></tr>';

    return boardString;
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
                    <td id="'+deckCell+drawnCard+'" onclick="clic('+deckCell+drawnCard+');"style="background-color:'+unselectedColor+'">\
                        <img src="cards/'+codeFromId(backCard)+'.svg">\
                    </td>\
                    <td></td>\
                </tr>\
                    <div></div>\
            </tbody>\
        </table>\
        <table>\
            <tbody id="gameboard"></tbody>\
        </table>\
        '
    document.getElementById("gameboard").innerHTML = buildGameboard();
};

//Called on page load
var init = function () {
    var selectedCard = null;
    var selectedCell = null;
    var cardIsDrawn = false;

    statusMatrix = [];

    //Create a deck of 52 cards
    deck = iota(deckLength);

    shuffle(deck);

    drawnCard = 0;

    buildUI();


};

//Ends the current game by reseting the UI and game progress
var endGame = function(){
    window.alert("Game Over");
    init();
};

var selectCell = function(cellId, cardId){
    var cell = document.getElementById(cellId);
    cell.style.backgroundColor = selectedColor;
    selectedCard = cardId;
    selectedCell = cellId;
};

var unselectCell = function(){
    if(selectedCard != null){
        var cell = document.getElementById(selectedCell);
        cell.style.backgroundColor = unselectedColor;
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

var isDeckCell = function(cellId){
    return getCellNum(cellId) == deckCell;
};

var draw = function(cellId){
    var cell = document.getElementById(cellId);
    cell.innerHTML = '<img src="cards/'+ codeFromId(deck[drawnCard]) +'.svg">';
    cardIsDrawn = true;
};

var initDeck = function(cellId){
    var cell = document.getElementById(cellId);
    drawnCard++;
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

var isEmpty = function(cellId){
    return getCardId(cellId) == emptyCard;
};

var updateCell = function(cellId, newCardId, isSelectedCell, toggleScoreCalculation){
    var cell = document.getElementById(cellId);
    cell.id = getCellNum(cellId) + newCardId;
    cellId = cell.id;
    cell.onclick = function(){clic(cellId);};
    cell.innerHTML = '<img src="cards/'+ codeFromId(newCardId) +'.svg">';
    if(isSelectedCell){
        selectCell(cellId, newCardId);
    }
    updateScore(cellId);
    if(toggleScoreCalculation){
        calculateScore();
    }
};

var updateScore = function(cellId, calculateScore){
    var cell = document.getElementById(cellId);
    var cellNum = getCellNum(cellId);
    var cardId = +getCardId(cellId);
    statusMatrix[cellNum[0] - 1][cellNum[1] - 1] = cardId;
};

var calculateScore = function(){
    statusMatrix.forEach(function(hand, i){
        var score = handScore(hand);
        var cellId = i + 1 + "6";
        document.getElementById(cellId).innerHTML = score;
    });
};

var handScore = function(hand){
    var score = 0;

    var values = copy(valuesFrom(hand));

    //console.log("Appel #" + (i+1));
    removeEmpty(values);
    score = evaluate(fullHouseAndLess(values, ""));

    if(score < 25){
        values = copy(valuesFrom(hand));
        
        removeEmpty(values);
        var result = quinte(values);
        if(result > score){
            score = result;
        }
    }

    //score = 


    if(score <= 0){
        score = "";
    }
    return score;
};

var quinte = function(cards){
    trier(cards);
    var streak = 1;
    var aceAndKing = cards[0] == 1 && cards[cards.length - 1] == 13;

    if(aceAndKing){
        streak++;
    }
    for (var i = 1; i < cards.length; i++) {
        if(cards[i] - cards[i - 1] == 1){
            streak++;
        }
        else if(!(aceAndKing && i == 1)){
            streak = 0;
        }
    }
    //console.log(cards + ": " + streak);
    if(streak == 5){
        //console.log("allo");
        return 15;
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
}

var getValue = function(cardId){
    return Math.floor(cardId / 4) + 1;
};

var valuesFrom = function(cards){
    var values = cards.map(function(card){
        if(card != emptyCard){
            return getValue(card);
        }
        return emptyCard;
    });
    return values;
};

//Manages the click of a card or card cell
var clic = function(cellId){
    if(isDeckCell(cellId)){
        if(selectedCard != null){
            unselectCell();
        }
        else {
            if(!cardIsDrawn){
                draw(cellId);
            }
            selectCell(cellId, deck[drawnCard]);
        }
    }
    else if(selectedCard == null){
        selectCell(cellId, getCardId(cellId));
    }
    else{
        if(isDeckCell(selectedCell) && isEmpty(cellId)){
            var end = initDeck(selectedCell);
            updateCell(cellId, selectedCard, false, true);
            unselectCell();
            if(end){
                endGame();
            }
        }
        else if(isDeckCell(selectedCell)){
            unselectCell();
            selectCell(cellId, getCardId(cellId));
        }
        else{
            var cardId = getCardId(cellId);//keep a backup
            updateCell(cellId, selectedCard);
            updateCell(selectedCell, cardId, true, true);
            unselectCell();
        }
    }
};