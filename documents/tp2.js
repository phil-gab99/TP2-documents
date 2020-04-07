var backCardCode = 53;
var emptyCardCode = 52;
var deckLength = 52;
var currentCard = 0;
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
    console.log(id + ": " + number + type);

    return number + type;
    
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
        '

    //document.getElementById("0").style.backgroundColor = "lime";


};

var clic = function(card){

    if(card == backCardCode){
        var newCard = deck[currentCard];

        //document.getElementById(card).onclick = "clic("+newCard+")";

        document.getElementById(card).innerHTML = '<img src="cards/'+ cardFromId(newCard) +'.svg">';

        document.getElementById(card).style.backgroundColor = "lime";

        //document.getElementById(card).id = newCard;

        currentCard++;
    }

    //<td id="25" onclick="clic(25);" style="background-color: lime;">\
};