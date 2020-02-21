
class Cards{

    constructor(suit, card){

        this.deck = [];
        this.dealtCards = [];

        this.values = ["2", "3", "4",  "5", "6", "7",  "8", "9", "10",  "Jack", "Queen", "King", "Ace"];

        this.suits = ["Hearts", "Spades", "Clubs", "Diamonds"];

    }


    generateDeck(){

        let s = this.suits.length;
        let v = this.values.length;

        let createDeck = (suit, value) => {

            return {suit: suit, value: value, name: value + 'of' + suit};

        }

        for(let i = 0; i < s; i++){

            for(let j = 0; j < v; j++){

                this.deck.push(createDeck(this.suits[i], this.values[j]));
            }
        }

    }


    printDeck(){

        let d = this.deck.length;

        if(d !== 0){

            for(let i = 0; i < d; i++){
    
                console.log(this.deck[i].name)    
        
            }
        }

        else console.log("Create a Deck of Cards by calling 'generateDeck' method!")
    }

    shuffle(){

        let currentIndex = this.deck.length, randNum, temp;
      
        while(currentIndex !== 0){

            randNum = Math.floor(Math.random() * currentIndex);
            currentIndex-=1 ;

            temp = this.deck[currentIndex];
            this.deck[currentIndex] = this.deck[randNum];
            this.deck[randNum] = temp;
        }
        
    }

    deal(){
        let dealtCard;

        if (this.deck.length) {
            dealtCard = this.deck.pop();
            this.dealtCards.push(dealtCard);
            return dealtCard; 
        }
        else return console.log("Deck is empty!");
    }

    replace(){

        this.deck.push(this.dealtCards.pop());
    }

    clearDeck(){
        this.deck = [];
    }

}

let card = new Cards();
card.generateDeck();
card.shuffle();

/////////////////////////////////// End of Card Class //////////////////////////////////////

////////// DOM Elements /////////////////////////////

const hitButton =  document.querySelector("#hitBtn");
const standButton = document.querySelector("#standBtn");
const dealButton = document.querySelector("#dealBtn");
const leftPlayer = document.querySelector("#leftPlayer");
const rightPlayer = document.querySelector("#rightPlayer");
const myPoint = document.querySelector("#myPoint");
const comPoint = document.querySelector("#comPoint");
const shuffleButton = document.querySelector("#shuffleBtn");
const result = document.querySelector("#name");
const winningScore = document.querySelector("#winningScore");
const losesScore = document.querySelector("#losesScore");
const drawScore = document.querySelector("#drawScore");

//////////////////////////////////////////////////////////////

///////////// Audio Sounds ///////////////////////

const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const loseSound = new Audio("sounds/aww.mp3");

///////////////////////////////////////////////////

//////////// Object Literals /////////////////////////////////////////////////////////////////////////////////

let Player = {'playGround': leftPlayer, 'scoreBoard': myPoint, 'score': 0, 'wins': 0, 'loses': 0, 'draw': 0};
let Computer = {'playGround': rightPlayer, 'scoreBoard': comPoint, 'score': 0}
let switches = {'stand': false, 'hit': false, 'deal': false};
let cardPoints = {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'Jack': 10,'Queen': 10,
                'King': 10,'Ace': [1,11]}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

setPoints(Player);

///////////////// Event Listeners //////////////////////

hitButton.addEventListener("click", generateCard);
dealButton.addEventListener("click", dealCard);
standButton.addEventListener("click", dealerPlaying);
shuffleButton.addEventListener("click", shuffleCards);

////////////////////////////////////////////////////////



function generateCard(){

    if (switches.hit === false) {
        let card1 = card.deal();
        showCard(Player, card1);
        showResult(Player, card1);
        setPoints(Player);
        switches.stand = true;
    }
    
}

function showCard(activePlayer, card){

    if (activePlayer.score <= 21) {
        hitSound.play();
        const img = document.createElement("img");
        img.src = `images/${card.name}.png`;
        activePlayer.playGround.appendChild(img);
    }
}


function showResult(activePlayer, card){

    if(card.value === 'Ace'){

        if(activePlayer.score + cardPoints[card.value][1] <= 21){
            activePlayer.score += cardPoints[card.value][1];   
        }
        else{
            activePlayer.score += cardPoints[card.value][0];
        }

    }
    else{
        activePlayer.score += cardPoints[card.value];
    }

}


function setPoints(player){
    if(player.score > 21){
        player.scoreBoard.innerHTML = "BUST!";
        player.scoreBoard.style.color = 'red'
    }
    else{
        player.scoreBoard.innerHTML = player.score;
    }
}


function dealCard(){

    if (switches.deal) {
        let images = leftPlayer.querySelectorAll("img");

        let dealerImages = rightPlayer.querySelectorAll("img");

        Player.scoreBoard.style.color = Computer.scoreBoard.style.color = '#ffffff'

        Player.score = 0;
        Computer.score = 0;

        setPoints(Player);
        setPoints(Computer);

        for (let i = 0; i < images.length; i++) {
            images[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        switches.stand = false;
        switches.hit = false;
        switches.deal = false;
    }
}

function sleep(t){
    let a = new Promise(resolve =>{
        setTimeout(resolve, t);
    });

    return a;
}

async function dealerPlaying(){

    if (switches.stand) {

        while (Computer.score <= 17) {
            let card1 = card.deal();

            showCard(Computer, card1);
            showResult(Computer, card1);
            setPoints(Computer);
            await sleep(1000);
        }

        switches.hit = true;
        resultShow(computeWinner());
        switches.deal = true;
        switches.stand = false;

        // if (Computer.score >= 17) {
        //     resultShow(computeWinner());
        //     switches.deal = true;
        //     switches.stand = false;
        // }
    }
}


function computeWinner(){

    let winner;

    if(Player.score <= 21){
        if(Computer.score < Player.score || Computer.score > 21){
            winner = Player;
            Player.wins++;
        }
        else if(Computer.score > Player.score){
            winner = Computer;
            Player.loses++;
        }
        else if(Player.score === Computer.score){
            Player.draw++;
        }

    }
    else if(Player.score > 21 && Computer.score <= 21){
        winner = Computer;
        Player.loses++;
    }
    else if(Player.score > 21 && Computer.score > 21){
        Player.draw++;
    }

    return winner;
}

function resultShow(winner){ 

    if(winner === Player){
        result.innerHTML = "PLAYER WINS!";
        result.style.color = 'green';
        winSound.play();
        winningScore.innerHTML = Player.wins;
    }
    else if(winner === Computer){
        result.innerHTML = "DEALER WINS!";
        result.style.color = 'red';
        loseSound.play();
        losesScore.innerHTML = Player.loses;
    }
    else{
        result.innerHTML = "DRAW!";
        result.style.color = 'black';
        drawScore.innerHTML = Player.draw;
    }

    setInterval(()=>{
        result.innerHTML = "BLACKJACK";
        result.style.color = '#212529';
    }, 2000);
}


function shuffleCards() {

    card.clearDeck();
    card.generateDeck();
    card.shuffle();
    console.log(card);

}
