///////// ------- //////////
// code by jpmcb, find me on twitter @jpmmcbride, message me with questions!!

//the sequence of colors the game has generated, tested against user input
var currentPattern = [];

//keep track of what index the programming is checking against player input
var playerInputTracking = 0;

//-- object for game functions, computer turn, buttons, and player turn
var simon = {
  
  // --- declare button functions of simon for the different game options in the DOM --- //
  
  counter : { //keep track of how many patterns in the current game
    element : document.getElementById("counter"),
    addOne : function () {
      this.element.innerHTML = Number(simon.counter.element.innerHTML) + 1;
      if (this.element.innerHTML === NaN) {
        this.element.innerHTML = 21;
      }
    }
  },
  
  resetButton : { //reset the game to default state
    element : document.getElementById("reset-switch"),
    resetGame : function () {
      currentPattern = [];
      playerInputTracking = 0;
      simon.counter.element.innerHTML = 0;
      window.setTimeout(simon.counter.reset, 2000);
      window.setTimeout(simon.computer.turn, 2000);
    }
  },
    
  onSwitch : { //turn the game on or off
    element : document.getElementById("on-off-switch"),
    power : 'off',
    turnGameOn : function () {
      this.power = 'on';
      this.element.style.backgroundColor = '#c94418';
      document.getElementById("on-off-switch-text").innerHTML = 'On';
      simon.blue.element.className = '';
      simon.red.element.className = '';
      simon.yellow.element.className = '';
      simon.green.element.className = '';
      
      //start the game after 1 1/2 seconds turning game on
      window.setTimeout(simon.computer.turn, 1500);
    },
    
    turnGameOff : function () {
      this.power = 'off';
      this.element.style.backgroundColor = '#a5a5a5';
      document.getElementById("on-off-switch-text").innerHTML = 'Off';
      simon.blue.element.className += ' off';
      simon.red.element.className += ' off';
      simon.yellow.element.className += ' off';
      simon.green.element.className += ' off';
      currentPattern = [];
      playerInputTracking = 0;
      simon.counter.element.innerHTML = 0;
      
      if (simon.strictSwitch.power === 'on') {
        simon.strictSwitch.strictModeOff();
      }
    }
  },
  
  strictSwitch : { //turn on strict mode --> game over if player misses pattern
    element : document.getElementById("strict-switch"),
    power : 'off',
    strictModeOn : function () {
      this.element.style.backgroundColor = '#c94418';
      this.power = 'on';
    },
    strictModeOff : function () {
      this.element.style.backgroundColor = '#a5a5a5';
      this.power = 'off';
    }
  },
  
  
  //declare the four game input switches / colors in relation to DOM
  blue : {
    element : document.getElementById("blue"),
  },
  red : {
    element : document.getElementById("red"),
  },
  yellow : {
    element : document.getElementById("yellow"),
  },
  green : {
    element : document.getElementById("green"),
  },
  
  //declare the function for random computer output & color
  computer : {
    randomColor : function () {
      var random = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
      var color; //asign random number to random color
      if (random === 1) {color = 'blue';}
      if (random === 2) {color = 'red';}
      if (random === 3) {color = 'yellow';}
      if (random === 4) {color = 'green';}
      
      currentPattern.push(color); //push random color to the current game pattern array
      playerPattern = []; //reset player pattern each time it's the computer's turn
    }, 
    
    turn : function () {
      playerInputTracking = 0; //start checking player input from start again
      simon.computer.randomColor();
      console.log(currentPattern);
      simon.counter.addOne();
      if(Number(simon.counter.element.innerHTML) > 20) {
        simon.counter.element.innerHTML = 'You win!';
      }
      simon.computer.playSounds();
    },
    
    playSounds : function () {
      var i = 0;
      function playPattern () {
        if (simon[currentPattern[i]] === undefined) {
          window.clearInterval(interval); // for when game is cleared in the middle of play
        }
        
        var workingElement = simon[currentPattern[i]].element;
        
        workingElement.firstChild.play(); //play the sound
        workingElement.className += ' ' + currentPattern[i] + '-active';
        function removeClass() {
          workingElement.className -= ' ' + currentPattern[i] + '-active';
        }
        window.setTimeout(removeClass, 500);
        i++;
        if (i >= currentPattern.length) {
          window.clearInterval(interval);
          simon.player.turn();
        }
      }
      
      var interval = window.setInterval(playPattern, 1000);
    }
  },
  
  // --- methods & functions for player turn
  player : {
    
    pickedColor : function(color) { 
      if(simon.onSwitch.power === 'on') {
        var x = playerInputTracking;
          if (currentPattern[x] === color) {
            simon[color].element.firstChild.play();
            playerInputTracking++;
            if (playerInputTracking >= currentPattern.length) {
              window.setTimeout(simon.computer.turn, 1000);
            } else {
              simon.player.turn();
            }
          } else {
            simon[color].element.firstChild.play();
            document.getElementById('options').style.backgroundColor = '#56000c';
            playerInputTracking = 0;
            window.setTimeout(function (){
              document.getElementById('options').style.backgroundColor = '#1e1e1e';
            }, 500);
            if (simon.strictSwitch.power === 'on') {
              simon.resetButton.resetGame();
            } else if (simon.strictSwitch.power ==='off') {
              window.setTimeout(simon.computer.playSounds, 1000);
            }
          }
        }
      },
    
    turn : function () { //onclick event functions to be called on player input
      if (simon.onSwitch.power === 'on') {
        simon.blue.element.onclick = function () {simon.player.pickedColor('blue')};
        simon.red.element.onclick = function () {simon.player.pickedColor('red')};
        simon.yellow.element.onclick = function () {simon.player.pickedColor('yellow')};
        simon.green.element.onclick = function () {simon.player.pickedColor('green')};
      }
    }
  }
}

simon.onSwitch.element.onclick = function () {
  if (simon.onSwitch.power === 'on') {
    simon.onSwitch.turnGameOff();
  } else if (simon.onSwitch.power === 'off') {
    simon.onSwitch.turnGameOn();
  }
}

simon.strictSwitch.element.onclick = function () {
  if(simon.onSwitch.power === 'on') {
    if(simon.strictSwitch.power === 'on') {
      simon.strictSwitch.strictModeOff();
    } else if (simon.strictSwitch.power === 'off') {
      simon.strictSwitch.strictModeOn();
    }
  }
}

simon.resetButton.element.onclick = function () {
  simon.resetButton.resetGame();
}