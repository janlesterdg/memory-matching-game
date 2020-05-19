//Show Reviewer
const reviewModal = document.getElementById('reviewModal');
function openReviewModal() {
    // adds the class name "show-modal" to display the modal.
    reviewModal.classList.add('show-modal');
}

function closeReviewModal() {
    // removes the class name "show-modal" to hide the modal.
    reviewModal.classList.remove('show-modal');
}

// Main Game Play
let gameCards = document.getElementsByClassName('game-card');
let gameCardsArray = [...gameCards];
let cardImage = document.getElementsByClassName('game-card-img');
let cardImageArray = [...cardImage];
let playerRating = document.getElementsByClassName('star');
let playerRatingArray = [...playerRating];
let counter = document.getElementById('moveCounter');
let timer = document.getElementById('timer');
let finalScore = document.getElementById('gameOverModal');
let totalMoves = document.getElementById('totalGameMoves');
let totalTime = document.getElementById('totalGameTime');
let finalStar = document.getElementById('finalStarRating');
let modalClose = document.getElementById('closeModal');
let openedCards = [];
let matchedCards =  [];
let moves;
let second = 0,
    minute = 0,
    hour = 0,
    interval,
    totalGameTime,
    starRating;

    // Lester de Guzman
    // This is known as Fisher-Yates (aka Knuth) Shuffle.
    // With this function, we should be able to shuffle our cards on the game board on load or restart.
    function shuffle(array) {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !==0) {
            // A random item is picked from all remaining items.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // A temporary placeholder variable is used to store the current value of the array in the loop itself.
            temporaryValue = array[currentIndex];
            // the current loop value is replaced by the new random pick.
            array[currentIndex] = array[randomIndex];
            // The placeholder is then used to replace the random array value, essentially swapping the random and current loop values.
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // Lester de Guzman
    function startGame() {
        //the array  of game card images is set as an arguement to the shuffle function.
        let shuffledImages = shuffle(cardImageArray);

        // This loops through the array of shuffledImages and it increments the value of "i" by 1 until the condition is false.
        for(i=0; i<shuffledImages.length; i++) {
            // remove all images from previous games from each card (if any) by changing the html content's value into "".
            gameCards[i].innerHTML = "";

            // add the shuffled images to each card.
            gameCards[i].appendChild(shuffledImages[i]);
            // game cards object is given a type property that corresponds to the alt text of each image to distinguish the card from others.
            gameCards[i].type = `${shuffledImages[i].alt}`;

            //remove all extra classes for game play
            gameCards[i].classList.remove("show", "open", "match", "disabled");
            // returns a collection of an element's child elements located at index 0 and removes the class name "show-img".
            gameCards[i].children[0].classList.remove("show-img");
        }

        // This loops through the array of game cards and it increments the value of "i" by 1 until the condition is false.
        for(let i = 0; i < gameCardsArray.length; i++) {
            // Add an event listener on the game cards that runs the function displayCard when a user clicks a button.
            gameCardsArray[i].addEventListener("click", displayCard)
        }

        //when game starts show all the cards for a split second
        flashCards();

        //reset moves by changing the html content's value into "0".
        moves = 0;
        counter.innerText = `${moves} move(s)`;

        // This loops through the array of player rating and it increments the value of "i" by 1 until the condition is false.
        for(let i=0; i<playerRatingArray.length; i++) {
            // reset player rating by changing the opacity back to 1 or 100%.
            playerRatingArray[i].style.opacity = 1;
        }

        // reset timer on game reset by changing the html content's value into "0".
        timer.innerHTML = '0 mins 0 secs';
        // clears the timer set with the setInterval() function.
        clearInterval(interval);
    }

    // Lester de Guzman
    // flash all the cards at once when the page loads
    function flashCards() {
        // This loops through the array of game cards and it increments the value of "i" by 1 until the condition is false.
        for(i=0; i<gameCards.length; i++) {
            // returns a collection of an element's child elements located at index 0 and adds the class name "show-img".
            gameCards[i].children[0].classList.add("show-img")
        }
        // calls a function or evaluates an expression after a 1000 milliseconds or 1 second.
        setTimeout(function(){
            // This loops through the array of game cards and it increments the value of "i" by 1 until the condition is false.
            for(i=0; i<gameCards.length; i++) {
                // returns a collection of an element's child elements located at index 0 and adds the class name "show-img".
                gameCards[i].children[0].classList.remove("show-img")
            }
        }, 1000)
    }

    // Harold Vinluan
    // toggles ‘open’, ‘show’ and ‘disabled’ classes.
    // this lets the card icon show and disables the card when it’s opened.
    function displayCard() {
        this.children[0].classList.toggle('show-img'); // returns the collection of an element's child element and returns to the class name "show-img".
        this.classList.toggle("open");  // it removes the specified class(open) from an element and returns false but if the class does not exist, it will add to the element and returns true.
        this.classList.toggle("show"); // it removes the specified class(show) from an element and returns false but if the class does not exist, it will add to the element and returns true.
        this.classList.toggle("disabled"); // it removes the specified class(disabled) from an element and returns false but if the class does not exist, it will add to the element and returns true.
        cardOpen(this); // will open the card once the return value is true.
    }

    // Harold Vinluan
    // add opened cards to OpenedCards list and check if cards are match or not
    function cardOpen(card) {
        openedCards.push(card);
        let len = openedCards.length; // declared a variable for the cards that are open.
        if(len === 2) { // checks and manage the card. The card that should be open must be 2 only.
            moveCounter(); // once that the user opened a 2 cards, the game will run the function "moveCounter".
            if(openedCards[0].type === openedCards[1].type) {  // if the first opened card and the second opened card matches, it will invoked the function "matched" but if not it will invoked the function "unmatched".
                matched();
            } else {
                unmatched();
            }
        }
    }

    // Harold Vinluan
    // adds a match class to the classList of each card
    // removes the show and open classes
    // pushes the two cards into an array called matchedCards and empties the openedCards
    function matched() { // When cards match, adds/removes relevant classes and clears the two cards' arrays.
        openedCards[0].classList.add("match");
        openedCards[1].classList.add("match");
        openedCards[0].classList.remove("show", "open");
        openedCards[1].classList.remove("show", "open");
        matchedCards.push(openedCards[0]); // the matched card will be put to the array named "openedcards"
        matchedCards.push(openedCards[1]);
        openedCards = [];
        if(matchedCards.length == 16) { // And if all the cards are matched already it will invoked the function named "endGame".
            endGame();
        }
    }

    // Harold Vinluan
    // adds the class unmatched to each card
    // temporarily disables clicking on the card using the disable() function
    // setting a time out of 1100ms after which the classes show, open, and unmatched are removed
    // the images are made invisible, then the cards are enabled using the enable() function.
    // Finally the openedCards array is emptied.
    function unmatched() {
        openedCards[0].classList.add("unmatched"); // When cards don't match, it will add a class "unmatched" to both and calls the function "disable".
        openedCards[1].classList.add("unmatched");
        disable();
        setTimeout(function() { // after that, it will remove the class "unmatched". calls the function "enable" to make the cards possible for flipping. And clears the two cards' array.
            openedCards[0].classList.remove("show", "open", "unmatched");
            openedCards[1].classList.remove("show", "open", "unmatched");
            openedCards[0].children[0].classList.remove('show-img');
            openedCards[1].children[0].classList.remove('show-img');
            enable();
            openedCards = [];

        }, 1100)
    }


// Gaius Claridad
// temporarily disables clicking on the card
function disable() {
    gameCardsArray.filter((card, i, gameCardsArray) => {
        card.classList.add('disabled');
    })
}

// Gaius Claridad
// enable cards and disable matched cards
function enable() {
    gameCardsArray.filter((card, i, gameCardsArray) => {
        card.classList.remove('disabled');
        for(let i=0; i<matchedCards.length; i++) {
            matchedCards[i].classList.add('disabled');
        }
    })
}

// Gaius Claridad
// increments the number of moves a player has done when two cards have been selected
// sets the innerHTML of my counter element to that value
function moveCounter() {
    moves++;
    counter.innerHTML = `${moves} move(s)`;

    if(moves == 1) {
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }

    // setting rating based on moves
    // the opacity of the icon is reduced after certain number of moves
    if(moves > 8 && moves <= 12) {
        for(let i=0; i<5; i++) {
            playerRatingArray[i].opacity = 1;
        }
    } else if(moves > 12 && moves <= 16) {
        for(let i=0; i<5; i++) {
            if(i > 3) {
                playerRatingArray[i].style.opacity = 0.1;
            }
        }
    } else if(moves > 16 && moves <= 20) {
        for(let i=0; i<5; i++) {
            if(i > 2) {
                playerRatingArray[i].style.opacity = 0.1;
            }
        }
    } else if(moves > 20 && moves <= 24) {
        for(let i=0; i<5; i++) {
            if(i > 1) {
                playerRatingArray[i].style.opacity = 0.1;
            }
        }
    } else if(moves > 24){
        for(let i=0; i<5; i++) {
            if(i > 0) {
                playerRatingArray[i].style.opacity = 0.1;
            }
        }
    }
}

// Tanya Paguio
// When the player starts a game, a displayed timer should also start.
// Once the player wins the game, the timer stops.
function startTimer() {
    interval = setInterval(function(){
        timer.innerHTML = `${minute} mins ${second} secs`; //this code represents the minutes and seconds
        second++;
        if(second == 60) { //when  it reach 60 seconds it will increment by 1 minute and so on.
            minute++;
            second = 0;
        }
        if(minute == 60) { // after it reaches 60 minutes it will increment to 1 hour.
            hour++;
            minute = 0;
        }
    }, 1000)
}

// Tanya Paguio
function endGame() {
    clearInterval(interval); // clears the interval used to create the timer
    totalGameTime = timer.innerHTML;
    starRating = document.querySelector('.rating').innerHTML;

    // show modal on game end
    finalScore.classList.add("show-modal"); //it will show a modal that contains the final score.

    // retrieves timer, the value of the move counter, and rating then shows a modal with those details.
    totalTime.innerHTML = totalGameTime;
    totalMoves.innerHTML = moves;
    finalStar.innerHTML = starRating;

    // clears the matchedCards array from the previous game when a game is restarted/refreshed without reloading the page.
    matchedCards = [];
    closeModal();
}

// Tanya Paguio
// closes the modal when the close button "X" is clicked
function closeModal() {
    modalClose.addEventListener("click", function() {
        finalScore.classList.remove("show-modal"); //the final score will be remove and it will start a new game
        startGame();
    })
}

// Tanya Paguio
// same with closing the modal, but here once the player clicks the play again button,
function playAgain() {
    finalScore.classList.remove("show-modal"); //the final score will be remove and it will start a new game
    startGame();
}

// wait for some milliseconds before game starts
window.onload = function () {
    setTimeout(function() {
        startGame()
    }, 1200);
}
