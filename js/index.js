const deckCards = [
  "Agility.png",
  "Agility.png",
  "Boat.png",
  "Boat.png",
  "Citizenship.png",
  "Citizenship.png",
  "Hack.png",
  "Hack.png",
  "Nerd-Rage.png",
  "Nerd-Rage.png",
  "Nuka-Cola.png",
  "Nuka-Cola.png",
  "Robotics.png",
  "Robotics.png",
  "Shock.png",
  "Shock.png",
];

const deck = document.querySelector(".deck");
let opened = [];
let matched = [];
let gameMode = "";

const modal = document.getElementById("modal");
const startModal = document.getElementById("start-modal");

const reset = document.querySelector(".reset-btn");
const playAgain = document.getElementById("play-again");
const movesCount = document.querySelector(".moves-counter");

const easyGame = document.getElementById("easyGame");
const mediumGame = document.getElementById("mediumGame");
const hardGame = document.getElementById("hardGame");

let moves = 0;
const star = document.getElementById("star-rating").querySelectorAll(".star");
let starCount = 3;
const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

let best_moves = 0;
let best_time = 0;
// Get the best moves and best time if present

// Function for getting the best score from Local Storage if present.
function getBestScores(bestMoves, bestTime) {
  if (localStorage.getItem(bestMoves)) {
    best_moves = localStorage.getItem(bestMoves);
  }
  if (localStorage.getItem(bestTime)) {
    best_time = localStorage.getItem(bestTime);
  }
}

//Function for setting the best score to localStorage
function setBestScores(bestMoves, bestTime) {
  localStorage.setItem(bestMoves, best_moves);
  localStorage.setItem(bestTime, best_time);
}

function showModalStart() {
  startModal.style.display = "block";
}

showModalStart();

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function startGame() {
  let cards = [];
  console.log(gameMode, mediumGame);
  if (gameMode === "easy") {
    cards = deckCards.slice(0, 4);
    deck.classList.add("easy");
  } else if (gameMode === "medium") {
    deck.classList.add("medium");
    cards = deckCards.slice(0, 8);
  } else {
    deck.classList.add("hard");
    cards = [...deckCards];
  }

  // Invoke shuffle function and store in variable
  const shuffledDeck = shuffle(cards);
  // Iterate over deck of cards array
  for (let i = 0; i < shuffledDeck.length; i++) {
    // Create the <li> tags
    const liTag = document.createElement("LI");
    // Give <li> class of card
    liTag.classList.add("card");
    // Create the <img> tags
    const addImage = document.createElement("IMG");
    // Append <img> to <li>
    liTag.appendChild(addImage);
    // Set the img src path with the shuffled deck
    addImage.setAttribute("src", "img/" + shuffledDeck[i]);
    // Add an alt tag to the image
    addImage.setAttribute("alt", "image of vault boy from fallout");
    // Update the new <li> to the deck <ul>

    const divTag = document.createElement("DIV");
    divTag.classList.add("tilt");
    divTag.appendChild(liTag);

    updateReflection(liTag, 100, 0);
    liTag.addEventListener("mousemove", (event) => {
      const scale = 0.03;
      const midX = (liTag.clientHeight / 2) * scale;
      const mouseXoffset = event.offsetX * scale;
      const mouseX = mouseXoffset - midX;

      const midY = (liTag.clientWidth / 2) * scale;
      const mouseYoffset = event.offsetY * scale;
      const mouseY = mouseYoffset - midY;
      updateReflection(liTag, mouseX * 50, mouseY * 50);
      const rotation = `rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
      liTag.style.transform = rotation;
    });

    liTag.addEventListener("mouseleave", (event) => {
      // liTag.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });

    // flip liTag on click
    liTag.addEventListener("click", (event) => {
      liTag.style.transform = `rotateX(0deg) rotateY(180deg)`;
    });

    deck.appendChild(divTag);
  }
}

function removeCard() {
  // As long as <ul> deck has a child node, remove it
  while (deck.hasChildNodes()) {
    deck.removeChild(deck.firstChild);
  }
}

function timer() {
  // Update the count every 1 second
  time = setInterval(function () {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    // Update the timer in HTML with the time it takes the user to play the game
    timeCounter.innerHTML =
      minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
  }, 1000);
}

function stopTime() {
  clearInterval(time);
}

function resetEverything() {
  // Stop time, reset the minutes and seconds update the time inner HTML
  stopTime();
  timeStart = false;
  seconds = 0;
  minutes = 0;
  timeCounter.innerHTML = "00:00";
  // Reset star count and the add the class back to show stars again
  star[1].firstElementChild.classList.add("fa-star");
  star[2].firstElementChild.classList.add("fa-star");
  starCount = 3;
  // Reset moves count and reset its inner HTML
  moves = 0;
  movesCount.innerHTML = 0;
  // Clear both arrays that hold the opened and matched cards
  matched = [];
  opened = [];
  // Clear the deck
  removeCard();

  if (gameMode === "easy") deck.classList.remove("easy");
  else if (gameMode === "medium") deck.classList.remove("medium");
  else deck.classList.remove("hard");
  startModal.style.display = "block";
}

function movesCounter() {
  // Update the html for the moves counter
  movesCount.innerHTML++;
  // Keep track of the number of moves for every pair checked
  moves++;
}

function starRating() {
  if (moves === 14) {
    // First element child is the <i> within the <li>
    star[2].firstElementChild.classList.remove("fa-star");
    starCount--;
  }
  if (moves === 18) {
    star[1].firstElementChild.classList.remove("fa-star");
    starCount--;
  }
}

function compareTwo() {
  // When there are 2 cards in the opened array
  if (opened.length === 2) {
    // Disable any further mouse clicks on other cards
    document.body.style.pointerEvents = "none";
  }
  // Compare the two images src
  if (opened.length === 2 && opened[0].src === opened[1].src) {
    // If matched call match()
    match();
    // console.log("It's a Match!");
  } else if (opened.length === 2 && opened[0].src != opened[1].src) {
    // If No match call noMatch()
    noMatch();
    // console.log("NO Match!");
  }
}

function match() {
  /* Access the two cards in opened array and add
  the class of match to the imgages parent: the <li> tag
  */
  setTimeout(function () {
    opened[0].parentElement.classList.add("match");
    opened[1].parentElement.classList.add("match");
    // Push the matched cards to the matched array
    matched.push(...opened);
    // Allow for further mouse clicks on cards
    document.body.style.pointerEvents = "auto";
    // Check to see if the game has been won with all 8 pairs
    winGame();
    // Clear the opened array
    opened = [];
  }, 600);
  // Call movesCounter to increment by one
  movesCounter();
  starRating();
}

function noMatch() {
  /* After 700 miliseconds the two cards open will have
  the class of flip removed from the images parent element <li>*/
  setTimeout(function () {
    // Remove class flip on images parent element
    opened[0].parentElement.classList.remove("flip");
    opened[1].parentElement.classList.remove("flip");
    // Allow further mouse clicks on cards
    document.body.style.pointerEvents = "auto";
    // Remove the cards from opened array
    opened = [];
  }, 700);
  // Call movesCounter to increment by one
  movesCounter();
  starRating();
}

function calculateBestScores(bestMoves, bestTime) {
  let total_time = minutes * 60 + seconds;
  best_moves = 0;
  best_time = 0;
  // When The browser has no best moves, or no best time
  getBestScores(bestMoves, bestTime);
  if (best_moves == 0 || best_time == 0) {
    best_moves = moves;
    best_time = total_time;
  } else {
    // If best move and best time are found compare the lowest best time and best move
    best_moves = Math.min(best_moves, moves);
    best_time = Math.min(best_time, total_time);
  }
  setBestScores(bestMoves, bestTime);
}

function AddStats() {
  // Access the modal content div

  const details = document.getElementById("modal-details");
  // Create three different paragraphs
  for (let i = 1; i <= 3; i++) {
    // Create a new Paragraph
    const statsElement = document.createElement("p");
    // Add a class to the new Paragraph
    statsElement.classList.add("stats");
    // Add the new created <p> tag to the modal content
    details.appendChild(statsElement);
  }

  // Select all p tags with the class of stats and update the content
  let p = details.querySelectorAll("p.stats");
  // Set the new <p> to have the content of stats (time, moves and star rating)

  // Get the best minutes and seconds from total time
  let best_minute = Math.floor(best_time / 60);
  let best_second = best_time % 60;
  // Set the new <p> to have the content of stats (time, moves and star rating)

  p[0].innerHTML = `Time taken: ${minutes} Minutes and ${seconds} Seconds (Best Time: ${best_minute} Minutes and ${best_second} Seconds)`;
  p[1].innerHTML = `Moves Taken: ${moves} (Best Moves: ${best_moves})`;
  p[2].innerHTML = `Your Star Rating is: ${starCount}/3`;
}
function displayModal() {
  // Access the modal <span> element (x) that closes the modal
  const modalClose = document.getElementsByClassName("close")[0];
  // When the game is won set modal to display block to show it
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  modalClose.onclick = function () {
    modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function winGame() {
  let len = 0;
  if (gameMode === "easy") len = 4;
  else len = gameMode === "medium" ? 8 : 16;

  if (matched.length === len) {
    stopTime();
    if (gameMode === "hard") {
      calculateBestScores("bestMovesHard", "bestTimeHard");
    } else if (gameMode === "medium") {
      calculateBestScores("bestMovesMedium", "bestTimeMedium");
    } else {
      calculateBestScores("bestMovesEasy", "bestTimeEasy");
    }
    AddStats();
    displayModal();
  }
}

deck.addEventListener("click", function (evt) {
  if (evt.target.nodeName === "LI") {
    // Start the timer after the first click of one card
    // Executes the timer() function
    if (timeStart === false) {
      timeStart = true;
      timer();
    }
    // Call flipCard() function
    flipCard();
  }

  //Flip the card and display cards img
  function flipCard() {
    // When <li> is clicked add the class .flip to show img
    evt.target.classList.add("flip");
    // Call addToOpened() function
    addToOpened();
  }

  //Add the fliped cards to the empty array of opened
  function addToOpened() {
    /* If the opened array has zero or one other img push another
      img into the array so we can compare these two to be matched
      */
    if (opened.length === 0 || opened.length === 1) {
      // Push that img to opened array
      opened.push(evt.target.firstElementChild);
    }
    // Call compareTwo() function
    compareTwo();
  }
});

reset.addEventListener("click", resetEverything);

easyGame.addEventListener("click", function () {
  console.log("ENTROU");
  startModal.style.display = "none";
  gameMode = "easy";
  startGame();
});

mediumGame.addEventListener("click", function () {
  startModal.style.display = "none";
  gameMode = "medium";
  console.log("ENTROU");
  startGame();
});

hardGame.addEventListener("click", function () {
  startModal.style.display = "none";
  gameMode = "hard";
  console.log("ENTROU");
  startGame();
});

playAgain.addEventListener("click", function () {
  modal.style.display = "none";
  resetEverything();
});

function updateReflection(card, degree, percentage) {
  card.style.background = `linear-gradient(${degree}deg, rgba(23, 180, 109 ,0.6) 0%,rgba(23, 180, 109,0.8) ${percentage}%,rgba(23, 180, 109,0.7) 100%)`;
  card.style.backgroundSize = "cover";
}
