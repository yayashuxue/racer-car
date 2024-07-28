import React, { useRef, useEffect, useState  } from 'react';

const GameComponent = () => {
  const gameAreaRef = useRef(null);
  const scoreRef = useRef(null);
  const fuelBarRef = useRef(null);
  const startScreenRef = useRef(null);
  const levelRef = useRef(null);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const score = scoreRef.current;
    const fuelBar = fuelBarRef.current;
    const startScreen = startScreenRef.current;
    const gameArea = gameAreaRef.current;
    const level = levelRef.current;


    let gameStart = new Audio();
    let gameOver = new Audio();

    // gameStart.src = "assets/audio/game_theme.mp3";
    // gameOver.src = "assets/audio/gameOver_theme.mp3";

    const levelSpeed = { easy: 7, moderate: 10, difficult: 14 };

    let keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    let player = { speed: 7, score: 0, fuel: 100 };

    level.addEventListener('click', (e) => {
      const id = e.target.id;

      player.speed = levelSpeed[id];
      console.log('player speed:', player.speed);
      console.log('player speed:', id);
      setActiveButton(id);  // Set the active button

    });

    startScreen.addEventListener('click', startGame);

    function startGame() {
      startScreen.classList.add('hide');
      gameArea.innerHTML = '';

      player.start = true;
      player.score = 0;
      player.fuel = 100;
      // gameStart.play();
      // gameStart.loop = true;
      window.requestAnimationFrame(gamePlay); 
      createFuelBar();

      for (let i = 0; i < 5; i++) {
        let roadLineElement = document.createElement('div');
        roadLineElement.setAttribute('class', 'roadLines');
        roadLineElement.y = i * 150;
        roadLineElement.style.top = roadLineElement.y + 'px';
        gameArea.appendChild(roadLineElement);
      }

      let carElement = document.createElement('div');
      carElement.setAttribute('class', 'car');
      gameArea.appendChild(carElement);

      player.x = carElement.offsetLeft;
      player.y = carElement.offsetTop;

      for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemyCar');
        enemyCar.y = (i + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + 'px';
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
        gameArea.appendChild(enemyCar);
      }

      let fuel = document.createElement('div');
      fuel.setAttribute('class', 'fuelCan');
      fuel.y = 1 * 350 * -1;
      fuel.style.top = fuel.y + 'px';
      // fuel.style.backgroundColor = randomColor();
      fuel.style.left = Math.floor(Math.random() * 350) + 'px';
      gameArea.appendChild(fuel);
      console.log('Fuel can created at position:', fuel.style.left, fuel.style.top);
      // setInterval(gamePlay, 10000000000 / 60); // 60 FPS
    }

    function randomColor() {
      function c(min, max) {
        let hex = Math.floor(Math.random() * (max - min + 1) + min).toString(16);
        return ('0' + String(hex)).substr(-2);
      }
    
      // Define ranges for red, green, and blue
      // Red: Full range (0-255)
      // Green: Limited range to avoid green (0-100)
      // Blue: Limited range to keep it reddish (0-100)
    
      let r = c(20, 255);
      let g = c(0, 100);
      let b = c(0, 150);
    
      return `#${r}${g}${b}`;
    }

    function onCollision(a, b) {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();

      return !(
        aRect.top > bRect.bottom ||
        aRect.bottom < bRect.top ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
      );
    }

    function onGameOver() {
      player.start = false;
      // gameStart.pause();
      // gameOver.play();
      startScreen.classList.remove('hide');
      startScreen.innerHTML =
        'Game Over <br> Your final score is ' +
        player.score +
        '<br> Press here to restart the game.';

        // todo: add the needed details for NFT update
        fetch('/api/submit-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ score: player.score }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }

    function moveRoadLines() {
      let roadLines = document.querySelectorAll('.roadLines');
      roadLines.forEach((item) => {
        if (item.y >= 700) {
          item.y -= 750;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
      });
    }

    function moveEnemyCars(carElement) {
      let enemyCars = document.querySelectorAll('.enemyCar');
      enemyCars.forEach((item) => {
        if (onCollision(carElement, item)) {
          onGameOver();
        }
        if (item.y >= 750) {
          item.y = -300;
          item.style.left = Math.floor(Math.random() * 350) + 'px';
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
      });
    }

    function moveFuel(carElement) {
      let fuelCan = document.querySelectorAll('.fuelCan');
      fuelCan.forEach((item) => {
        if (onCollision(carElement, item)) {
          collectFuel();
        }
        if (item.y >= 750) {
          item.y = -300;
          item.style.left = Math.floor(Math.random() * 350) + 'px';
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
      });
    }

    function collectFuel() {
      player.fuel = Math.min(player.fuel + 0.25, 100);
    }

    function updateFuel() {
      player.fuel -= 0.1;
      if (player.fuel <= 0) {
        onGameOver();
      }
    }

    function drawFuelBar() {
      fuelBar.style.width = player.fuel + '%';
    }

    function createFuelBar() {
      fuelBar.classList.add('fuelBar');
      document.querySelector('.carGame').appendChild(fuelBar);
      return fuelBar;
    }

    function gamePlay() {
      let carElement = document.querySelector('.car');
      let fuelElement = document.querySelector('.fuelCan');
      // let timeSlower = document.querySelector('.timeSlower');
      let road = gameArea.getBoundingClientRect();

      if (player.start) {
        moveRoadLines();
        moveEnemyCars(carElement);
        moveFuel(carElement);
        // movetimeslower(timeSlower);
        // moveItems(carElement);
        console.log('raod.bottom:', road.bottom);
        if (keys.ArrowUp && player.y > road.top + 70) {
          // if (Math.random() < 0.99) {
          //   // console.log("happening");
          //   createItem();
          // }
          player.y -= (player.speed+1)};
        if (keys.ArrowDown && player.y < 800) player.y += (player.speed+1);
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - 70) player.x += (player.speed+1);
        console.log('player x:', player.x, 'player y:', player.y);
        carElement.style.top = player.y + 'px';
        carElement.style.left = player.x + 'px';

        updateFuel();
        drawFuelBar();

        window.requestAnimationFrame(gamePlay, 1000 / 60);

        player.score++;
        const ps = player.score - 1;
        score.innerHTML = 'Score: ' + ps;
        fuelBar.innerHTML = 'Fuel: ' + player.fuel.toFixed(2);
        
      }
    }

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      keys[e.key] = false;
    });

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('keydown', (e) => {
        e.preventDefault();
        keys[e.key] = true;
      });
      document.removeEventListener('keyup', (e) => {
        e.preventDefault();
        keys[e.key] = false;
      });
    };
  }, []);

  return (
    <div className="carGame">
      <div ref={scoreRef} className="score"></div>
      <div ref={fuelBarRef} className="fuelBar"></div>
      <div ref={startScreenRef} className="startScreen">
        Click to Start Game
      </div>
      <div ref={levelRef} className="level">
        {/* <button id="easy" className={activeButton === 'easy' ? 'active' : ''}>Easy</button>
        <button id="moderate" className={activeButton === 'moderate' ? 'active' : ''}>Moderate</button>
        <button id="difficult" className={activeButton === 'difficult' ? 'active' : ''}>Difficult</button> */}
      </div>
      <div ref={gameAreaRef} className="gameArea"></div>
    </div>
  );
};

export default GameComponent;
