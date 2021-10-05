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
  const modal = document.getElementById("modal");
  const reset = document.querySelector(".reset-btn");
  const playAgain = document.querySelector(".play-again-btn");
  const movesCount = document.querySelector(".moves-counter");
  let moves = 0;
  const star = document
    .getElementById("star-rating")
    .querySelectorAll(".star");
  let starCount = 3;
  const timeCounter = document.querySelector(".timer");
  let time;
  let minutes = 0;
  let seconds = 0;
  let timeStart = false;

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
    // Invoke shuffle function and store in variable
    const shuffledDeck = shuffle(deckCards);
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
      deck.appendChild(liTag);
    }
  }

  startGame();

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
        "<i class='fa fa-hourglass-start'></i>" +
        " Timer: " +
        minutes +
        " Mins " +
        seconds +
        " Secs";
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
    timeCounter.innerHTML =
      "<i class='fa fa-hourglass-start'></i>" + " Timer: 00:00";
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
    // Create a new deck
    startGame();
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
    document.getElementById("score").innerHTML =
      parseInt(document.getElementById("score").innerHTML) + 1;
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

  function AddStats() {
    // Access the modal content div
    const stats = document.querySelector(".modal-content");
    // Create three different paragraphs
    for (let i = 1; i <= 3; i++) {
      // Create a new Paragraph
      const statsElement = document.createElement("p");
      // Add a class to the new Paragraph
      statsElement.classList.add("stats");
      // Add the new created <p> tag to the modal content
      stats.appendChild(statsElement);
    }
    // Select all p tags with the class of stats and update the content
    let p = stats.querySelectorAll("p.stats");
    // Set the new <p> to have the content of stats (time, moves and star rating)
    p[0].innerHTML =
      "Time to complete: " +
      minutes +
      " Minutes and " +
      seconds +
      " Seconds";
    p[1].innerHTML = "Moves Taken: " + moves;
    p[2].innerHTML = "Your Star Rating is: " + starCount + " out of 3";
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
    if (matched.length === 16) {
      stopTime();
      AddStats();
      displayModal();
    }
  }

  deck.addEventListener("click", function (evt) {
    if (evt.target.nodeName === "LI") {
      // To console if I was clicking the correct element
      console.log(evt.target.nodeName + " Was clicked");
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

  playAgain.addEventListener("click", function () {
    modal.style.display = "none";
    resetEverything();
  });