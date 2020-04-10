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
        var score = handScore(hand, i);
        var cellId = i + 1 + "6";
        document.getElementById(cellId).innerHTML = score;
    });
};

var handScore = function(hand, i){
    var score = 0;

    var values = valuesFrom(hand);

    console.log("Appel #" + (i+1));

    var cpy = copy(values);
    removeEmpty(cpy);
    score += findPairs(cpy, 0, 0);

    if(score <= 0){
        score = "";
    }
    return score;
};

var findPairs = function(values, count, call){
    call++;
    let first = values.shift();
    let i = values.indexOf(first);
    if(i >= 0 && first == values[i]){
        values.splice(i, 1);
        count++;
        console.log("2 x " + first + ", count = " + count);
        console.log("Call deepness: " + call);
    }
    if(values.length > 0){
        count = findPairs(values, count, call);
    }

    return count;

    // for(var i = 0; i < values.length - 1; i++){
    //     values.splice(i, 1);
    //     var j = indexOf(values[i], i + 1);
    //     if(values[i] == values[j]){
    //         count++;
    //         values.splice(j - 1, 1);
    //         break;
    //     }
    // }

    // var copy = values.slice();

    // copy.forEach(function(card, i){
    //     if(card != emptyCard){
    //         var nextOccurenceIndex = copy.indexOf(card, i + 1);
    //         if(nextOccurenceIndex > 0){
    //             var nextOccurence = copy[nextOccurenceIndex];
    //             if(card == nextOccurence){
    //                 //console.log("1: " + copy);
    //                 copy.splice(i, 1);
    //                 copy.splice(nextOccurenceIndex - 1, 1);
    //                 count++;
    //                 console.log(count);
    //                 //console.log("2: " + copy);
    //                 findPairs(copy, count);
    //             }
    //         }
    //     }
    // });

    // return count;
};

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