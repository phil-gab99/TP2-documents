var backCardCode = 53;
var emptyCardCode = 52;
var deckLength = 52;
var currentCard = 0;
var selectedCard = null;
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

var buildGameboard = function(){
    var gbStr = "";


    for (var i = 0; i < 5; i++) {
        gbStr += '<tr>';
        for (var j = 0; j < 5; j++) {
            gbStr += '<td id="'+(i+1)+(j+1)+'"><img src="cards/empty.svg" onclick="clic('+(i+1)+(j+1)+')"></td>';
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

var endGame = function(){
    window.alert("Game Over");
    init();
};

var init = function () {

    //Create a deck of 52 cards
    deck = iota(deckLength);

    //Shuffle the deck
    shuffle(deck);

    document.getElementById("b").innerHTML = '\
        <table>\
        <tbody>\
        <tr>\
        <td>\
        <button onclick="init();" style="float:left;">Nouvelle partie</button>\
        </td>\
        <td></td>\
        <td id="'+backCardCode+'" onclick="clic('+backCardCode+');"style="background-color: transparent;">\
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

    //document.getElementById("0").style.backgroundColor = "lime";


};

var clic = function(cellId){

    if(cellId == backCardCode && selectedCard == null){

        var card = deck[currentCard];

        document.getElementById(cellId).innerHTML = '<img src="cards/'+ cardFromId(card) +'.svg">';

        document.getElementById(cellId).style.backgroundColor = "lime";

        selectedCard = currentCard;

        currentCard++;

    }
    else if(cellId != backCardCode && selectedCard != null){

        var card = deck[selectedCard];

        document.getElementById(cellId).innerHTML = '<img src="cards/'+ cardFromId(card) +'.svg">';

        document.getElementById(backCardCode).innerHTML = '<img src="cards/back.svg">';

        selectedCard = null;

        if(currentCard >= deckLength){
            document.getElementById(backCardCode).innerHTML = '<img src="cards/empty.svg">';
            endGame();
        }

        document.getElementById(backCardCode).style.backgroundColor = "transparent";
    }
};