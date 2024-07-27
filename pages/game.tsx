import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useBalance } from 'wagmi';
import { apiUrl, config } from '../config';
import { useFetchTables } from '../src/apihook/useFetchTables';
import { Title } from 'src/components/Title';
import { useSnackBar } from 'src/hook/useSnackBar';
import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';

export type TableData = {
  tableId: number;
  players: number;
  status: string;
  bbSize: any;
  buyInAmount: any;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { showSuccess } = useSnackBar();
  const { user } = usePrivy();
  const address = user?.wallet?.address;

  const balance = useBalance({ address: address as `0x${string}`, chainId: config.chains[0].id });
  const { refetch } = balance;

  const [keys, setKeys] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const [player, setPlayer] = useState({ speed: 7, score: 0, fuel: 100, start: false, x: 0, y: 0 });

  const scoreRef = useRef<HTMLDivElement>(null);
  const fuelBarRef = useRef<HTMLDivElement>(null);
  const startScreenRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  const levelSpeed = { easy: 7, moderate: 10, difficult: 14 };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    console.log('Starting game...');

    if (startScreenRef.current) {
      startScreenRef.current.classList.add('hide');
    }

    if (gameAreaRef.current) {
      gameAreaRef.current.innerHTML = '';
    }

    setPlayer((prevPlayer) => ({ ...prevPlayer, start: true, score: 0, fuel: 100 }));

    window.requestAnimationFrame(gamePlay);

    createFuelBar();

    for (let i = 0; i < 5; i++) {
      const roadLineElement = document.createElement('div');
      roadLineElement.setAttribute('class', 'roadLines');
      roadLineElement.style.top = `${i * 150}px`;
      if (gameAreaRef.current) {
        gameAreaRef.current.appendChild(roadLineElement);
      }
    }

    const carElement = document.createElement('div');
    carElement.setAttribute('class', 'car');
    if (gameAreaRef.current) {
      gameAreaRef.current.appendChild(carElement);
    }

    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      x: carElement.offsetLeft,
      y: carElement.offsetTop,
    }));

    for (let i = 0; i < 3; i++) {
      const enemyCar = document.createElement('div');
      enemyCar.setAttribute('class', 'enemyCar');
      enemyCar.style.top = `${(i + 1) * 350 * -1}px`;
      enemyCar.style.backgroundColor = randomColor();
      enemyCar.style.left = `${Math.floor(Math.random() * 350)}px`;
      if (gameAreaRef.current) {
        gameAreaRef.current.appendChild(enemyCar);
      }
    }
  };

  const randomColor = () => {
    const c = () => {
      const hex = Math.floor(Math.random() * 256).toString(16);
      return ('0' + String(hex)).substr(-2);
    };
    return '#' + c() + c() + c();
  };

  const onCollision = (a: HTMLElement, b: HTMLElement) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
      aRect.top > bRect.bottom ||
      aRect.bottom < bRect.top ||
      aRect.right < bRect.left ||
      aRect.left > bRect.right
    );
  };

  const onGameOver = () => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, start: false }));

    if (startScreenRef.current) {
      startScreenRef.current.classList.remove('hide');
      startScreenRef.current.innerHTML = `Game Over <br> Your final score is ${player.score} <br> Press here to restart the game.`;
    }
  };

  const moveRoadLines = () => {
    const roadLines = document.querySelectorAll('.roadLines');
    roadLines.forEach((item) => {
      let itemElem = item as HTMLElement;
      if (parseInt(itemElem.style.top) >= 700) {
        itemElem.style.top = `${parseInt(itemElem.style.top) - 750}px`;
      }
      itemElem.style.top = `${parseInt(itemElem.style.top) + player.speed}px`;
    });
  };

  const moveEnemyCars = (carElement: HTMLElement) => {
    const enemyCars = document.querySelectorAll('.enemyCar');
    enemyCars.forEach((item) => {
      let itemElem = item as HTMLElement;
      if (onCollision(carElement, itemElem)) {
        onGameOver();
      }
      if (parseInt(itemElem.style.top) >= 750) {
        itemElem.style.top = `${-300}px`;
        itemElem.style.left = `${Math.floor(Math.random() * 350)}px`;
      }
      itemElem.style.top = `${parseInt(itemElem.style.top) + player.speed}px`;
    });
  };

  const createItem = () => {
    const item = document.createElement('div');
    item.setAttribute('class', 'item');
    item.style.top = '-300px';
    item.style.left = `${Math.floor(Math.random() * 350)}px`;
    if (Math.random() < 0.7) {
      item.classList.add('fuelCan');
    } else {
      item.classList.add('timeSlower');
    }
    if (gameAreaRef.current) {
      gameAreaRef.current.appendChild(item);
    }
  };

  const moveItems = (carElement: HTMLElement) => {
    const items = document.querySelectorAll('.item');
    items.forEach((item) => {
      let itemElem = item as HTMLElement;
      if (onCollision(carElement, itemElem)) {
        if (itemElem.classList.contains('timeSlower')) {
          activateTimeSlower();
        } else if (itemElem.classList.contains('fuelCan')) {
          collectFuel();
        }
        itemElem.remove();
      }
      if (parseInt(itemElem.style.top) >= 750) {
        itemElem.remove();
      }
      itemElem.style.top = `${parseInt(itemElem.style.top) + player.speed}px`;
    });
  };

  const activateTimeSlower = () => {
    const originalSpeed = player.speed;
    setPlayer((prevPlayer) => ({ ...prevPlayer, speed: prevPlayer.speed / 2 }));
    setTimeout(() => {
      setPlayer((prevPlayer) => ({ ...prevPlayer, speed: originalSpeed }));
    }, 5000);
  };

  const collectFuel = () => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, fuel: Math.min(prevPlayer.fuel + 20, 100) }));
  };

  const updateFuel = () => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, fuel: prevPlayer.fuel - 0.1 }));
    if (player.fuel <= 0) {
      onGameOver();
    }
  };

  const drawFuelBar = () => {
    if (fuelBarRef.current) {
      fuelBarRef.current.style.width = `${player.fuel}%`;
    }
  };

  const createFuelBar = () => {
    const fuelBar = document.createElement('div');
    fuelBar.classList.add('fuelBar');
    if (document.querySelector('.carGame')) {
      document.querySelector('.carGame')?.appendChild(fuelBar);
    }
    return fuelBar;
  };

  const gamePlay = () => {
    const carElement = document.querySelector('.car') as HTMLElement;
    const road = gameAreaRef.current?.getBoundingClientRect();

    if (player.start && road) {
      moveRoadLines();
      moveEnemyCars(carElement);
      moveItems(carElement);

      if (keys.ArrowUp && player.y > road.top + 70)
        setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y - prevPlayer.speed }));
      if (keys.ArrowDown && player.y < road.bottom - 85)
        setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y + prevPlayer.speed }));
      if (keys.ArrowLeft && player.x > 0)
        setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x - prevPlayer.speed }));
      if (keys.ArrowRight && player.x < road.width - 70)
        setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x + prevPlayer.speed }));

      if (carElement) {
        carElement.style.top = `${player.y}px`;
        carElement.style.left = `${player.x}px`;
      }

      updateFuel();
      drawFuelBar();

      window.requestAnimationFrame(gamePlay);

      setPlayer((prevPlayer) => ({ ...prevPlayer, score: prevPlayer.score + 1 }));
      if (scoreRef.current) {
        scoreRef.current.innerHTML = `Score: ${player.score - 1}`;
      }
      if (fuelBarRef.current) {
        fuelBarRef.current.innerHTML = `Fuel: ${player.fuel}`;
      }

      if (Math.random() < 0.02) {
        createItem();
      }
    }
  };

  return (
    <Box>
      <Box display='flex' justifyContent='center'>
        <Box width={{ xs: '100%', md: '50%' }} textAlign='center'>
          <Title>GAME</Title>
          <div className='carGame'>
            <div className='score' ref={scoreRef}></div>
            <div className='fuelBar' ref={fuelBarRef}></div>
            <div className='startScreen' ref={startScreenRef} onClick={startGame}>
              <p>
                Press here to start <br />
                Use Arrow keys to move <br />
                If you hit another car you will lose.
              </p>
              <div>
                Select Level
                <span className='level' ref={levelRef}>
                  <button
                    id='easy'
                    onClick={(e) =>
                      setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed['easy'] }))
                    }
                  >
                    Easy
                  </button>
                  <button
                    id='moderate'
                    onClick={(e) =>
                      setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed['moderate'] }))
                    }
                  >
                    Moderate
                  </button>
                  <button
                    id='difficult'
                    onClick={(e) =>
                      setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed['difficult'] }))
                    }
                  >
                    Difficult
                  </button>
                </span>
              </div>
            </div>
            <div className='gameArea' ref={gameAreaRef}></div>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
