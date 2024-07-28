// import { Box, Typography } from '@mui/material';
// import type { NextPage } from 'next';
// import Head from 'next/head';
// import { useEffect, useRef, useState } from 'react';
// import { useBalance } from 'wagmi';
// import { apiUrl, config } from '../config';
// import { useFetchTables } from '../src/apihook/useFetchTables';
// import { Title } from 'src/components/Title';
// import { useSnackBar } from 'src/hook/useSnackBar';
// import { useRouter } from 'next/router';
// import { usePrivy } from '@privy-io/react-auth';

// export type TableData = {
//   tableId: number;
//   players: number;
//   status: string;
//   bbSize: any;
//   buyInAmount: any;
// };

// const Home: NextPage = () => {
//   const router = useRouter();
//   const { showSuccess } = useSnackBar();
//   const { user } = usePrivy();
//   const address = user?.wallet?.address;

//   const balance = useBalance({ address: address as `0x${string}`, chainId: config.chains[0].id });
//   const { refetch } = balance;

//   const [keys, setKeys] = useState({
//     ArrowUp: false,
//     ArrowDown: false,
//     ArrowLeft: false,
//     ArrowRight: false,
//   });

//   const [player, setPlayer] = useState({ speed: 7, score: 0, fuel: 100, start: false, x: 0, y: 0 });

//   const scoreRef = useRef<HTMLDivElement>(null);
//   const fuelBarRef = useRef<HTMLDivElement>(null);
//   const startScreenRef = useRef<HTMLDivElement>(null);
//   const gameAreaRef = useRef<HTMLDivElement>(null);
//   const levelRef = useRef<HTMLDivElement>(null);

//   const levelSpeed = { easy: 7, moderate: 10, difficult: 14 };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       e.preventDefault();
//       setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
//     };

//     const handleKeyUp = (e: KeyboardEvent) => {
//       e.preventDefault();
//       setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('keyup', handleKeyUp);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   const startGame = () => {
//     console.log('Starting game...');

//     if (startScreenRef.current) {
//       startScreenRef.current.classList.add('hide');
//     }

//     if (gameAreaRef.current) {
//       gameAreaRef.current.innerHTML = '';
//     }

//     setPlayer((prevPlayer) => ({ ...prevPlayer, start: true, score: 0, fuel: 100 }));

//     window.requestAnimationFrame(gamePlay);

//     createFuelBar();

//     for (let i = 0; i < 5; i++) {
//       const roadLineElement = document.createElement('div');
//       roadLineElement.setAttribute('class', 'roadLines');
//       roadLineElement.style.top = `${i * 150}px`;
//       if (gameAreaRef.current) {
//         gameAreaRef.current.appendChild(roadLineElement);
//       }
//     }

//     const carElement = document.createElement('div');
//     carElement.setAttribute('class', 'car');
//     if (gameAreaRef.current) {
//       gameAreaRef.current.appendChild(carElement);
//     }

//     setPlayer((prevPlayer) => ({
//       ...prevPlayer,
//       x: carElement.offsetLeft,
//       y: carElement.offsetTop,
//     }));

//     for (let i = 0; i < 3; i++) {
//       const enemyCar = document.createElement('div');
//       enemyCar.setAttribute('class', 'enemyCar');
//       enemyCar.style.top = `${(i + 1) * 350 * -1}px`;
//       enemyCar.style.backgroundColor = randomColor();
//       enemyCar.style.left = `${Math.floor(Math.random() * 350)}px`;
//       if (gameAreaRef.current) {
//         gameAreaRef.current.appendChild(enemyCar);
//       }
//     }
//   };

//   const randomColor = () => {
//     const c = () => {
//       const hex = Math.floor(Math.random() * 256).toString(16);
//       return ('0' + String(hex)).substr(-2);
//     };
//     return '#' + c() + c() + c();
//   };

//   const onCollision = (a: HTMLElement, b: HTMLElement) => {
//     const aRect = a.getBoundingClientRect();
//     const bRect = b.getBoundingClientRect();

//     return !(
//       aRect.top > bRect.bottom ||
//       aRect.bottom < bRect.top ||
//       aRect.right < bRect.left ||
//       aRect.left > bRect.right
//     );
//   };

//   const onGameOver = () => {
//     setPlayer((prevPlayer) => ({ ...prevPlayer, start: false }));

//     if (startScreenRef.current) {
//       startScreenRef.current.classList.remove('hide');
//       startScreenRef.current.innerHTML = `Game Over <br> Your final score is ${player.score} <br> Press here to restart the game.`;
//     }
//   };

//   const moveRoadLines = () => {
//     const roadLines = document.querySelectorAll('.roadLines');
//     roadLines.forEach((item) => {
//       let itemElem = item as HTMLElement;
//       if (parseInt(itemElem.style.top) >= 700) {
//         itemElem.style.top = `${parseInt(itemElem.style.top) - 750}px`;
//       }
//       itemElem.style.top = `${parseInt(itemElem.style.top) + player.speed}px`;
//     });
//   };

//   const moveEnemyCars = (carElement: HTMLElement) => {
//     const enemyCars = document.querySelectorAll('.enemyCar');
//     enemyCars.forEach((item) => {
//       let itemElem = item as HTMLElement;
//       if (onCollision(carElement, itemElem)) {
//         onGameOver();
//       }
//       if (parseInt(itemElem.style.top) >= 750) {
//         itemElem.style.top = `${-300}px`;
//         itemElem.style.left = `${Math.floor(Math.random() * 350)}px`;
//       }
//       itemElem.style.top = `${parseInt(itemElem.style.top) + player.speed}px`;
//     });
//   };

//   const createItem = () => {
//     const item = document.createElement('div');
//     item.setAttribute('class', 'item');
//     item.style.top = '-300px';
//     item.style.left = `${Math.floor(Math.random() * 350)}px`;
//     if (Math.random() < 0.7) {
//       item.classList.add('fuelCan');
//     } else {
//       item.classList.add('timeSlower');
//     }
//     if (gameAreaRef.current) {
//       gameAreaRef.current.appendChild(item);
//     }
//   };

//   const moveItems = (carElement: HTMLElement) => {
//     const items = document.querySelectorAll('.item');
//     items.forEach((item) => {
//       let itemElem = item as HTMLElement;
//       if (onCollision(carElement, itemElem)) {
//         if (itemElem.classList.contains('timeSlower')) {
//           activateTimeSlower();
//         } else if (itemElem.classList.contains('fuelCan')) {
//           collectFuel();
//         }
//         itemElem.remove();
//       }
//       if (parseInt(itemElem.style.top) >= 750) {
//         itemElem.remove();
//       }
//       itemElem.style.top = `${parseInt(itemElem.style.top) + player.speed}px`;
//     });
//   };

//   const activateTimeSlower = () => {
//     const originalSpeed = player.speed;
//     setPlayer((prevPlayer) => ({ ...prevPlayer, speed: prevPlayer.speed / 2 }));
//     setTimeout(() => {
//       setPlayer((prevPlayer) => ({ ...prevPlayer, speed: originalSpeed }));
//     }, 5000);
//   };

//   const collectFuel = () => {
//     setPlayer((prevPlayer) => ({ ...prevPlayer, fuel: Math.min(prevPlayer.fuel + 20, 100) }));
//   };

//   const updateFuel = () => {
//     setPlayer((prevPlayer) => ({ ...prevPlayer, fuel: prevPlayer.fuel - 0.1 }));
//     if (player.fuel <= 0) {
//       onGameOver();
//     }
//   };

//   const drawFuelBar = () => {
//     if (fuelBarRef.current) {
//       fuelBarRef.current.style.width = `${player.fuel}%`;
//     }
//   };

//   const createFuelBar = () => {
//     const fuelBar = document.createElement('div');
//     fuelBar.classList.add('fuelBar');
//     if (document.querySelector('.carGame')) {
//       document.querySelector('.carGame')?.appendChild(fuelBar);
//     }
//     return fuelBar;
//   };

//   const gamePlay = () => {
//     const carElement = document.querySelector('.car') as HTMLElement;
//     const road = gameAreaRef.current?.getBoundingClientRect();

//     if (player.start && road) {
//       moveRoadLines();
//       moveEnemyCars(carElement);
//       moveItems(carElement);

//       if (keys.ArrowUp && player.y > road.top + 70)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y - prevPlayer.speed }));
//       if (keys.ArrowDown && player.y < road.bottom - 85)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y + prevPlayer.speed }));
//       if (keys.ArrowLeft && player.x > 0)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x - prevPlayer.speed }));
//       if (keys.ArrowRight && player.x < road.width - 70)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x + prevPlayer.speed }));

//       if (carElement) {
//         carElement.style.top = `${player.y}px`;
//         carElement.style.left = `${player.x}px`;
//       }

//       updateFuel();
//       drawFuelBar();

//       window.requestAnimationFrame(gamePlay);

//       setPlayer((prevPlayer) => ({ ...prevPlayer, score: prevPlayer.score + 1 }));
//       if (scoreRef.current) {
//         scoreRef.current.innerHTML = `Score: ${player.score - 1}`;
//       }
//       if (fuelBarRef.current) {
//         fuelBarRef.current.innerHTML = `Fuel: ${player.fuel}`;
//       }

//       if (Math.random() < 0.02) {
//         createItem();
//       }
//     }
//   };

//   return (
//     <Box>
//       <Box display='flex' justifyContent='center'>
//         <Box width={{ xs: '100%', md: '50%' }} textAlign='center'>
//           <Title>GAME</Title>
//           <div className='carGame'>
//             <div className='score' ref={scoreRef}></div>
//             <div className='fuelBar' ref={fuelBarRef}></div>
//             <div className='startScreen' ref={startScreenRef} onClick={startGame}>
//               <p>
//                 Press here to start <br />
//                 Use Arrow keys to move <br />
//                 If you hit another car you will lose.
//               </p>
//               <div>
//                 Select Level
//                 <span className='level' ref={levelRef}>
//                   <button
//                     id='easy'
//                     onClick={(e) =>
//                       setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed['easy'] }))
//                     }
//                   >
//                     Easy
//                   </button>
//                   <button
//                     id='moderate'
//                     onClick={(e) =>
//                       setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed['moderate'] }))
//                     }
//                   >
//                     Moderate
//                   </button>
//                   <button
//                     id='difficult'
//                     onClick={(e) =>
//                       setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed['difficult'] }))
//                     }
//                   >
//                     Difficult
//                   </button>
//                 </span>
//               </div>
//             </div>
//             <div className='gameArea' ref={gameAreaRef}></div>
//           </div>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Home;


// ver2



// import React, { useEffect, useRef, useState } from 'react';

// const Game = () => {
//   const [player, setPlayer] = useState({ speed: 7, score: 0, fuel: 100, start: false, x: 0, y: 0 });
//   const [keys, setKeys] = useState({
//     ArrowUp: false,
//     ArrowDown: false,
//     ArrowLeft: false,
//     ArrowRight: false,
//   });
//   const [levelSpeed] = useState({ easy: 7, moderate: 10, difficult: 14 });
//   // const [gameStart, setGameStart] = useState(new Audio('assets/audio/game_theme.mp3'));
//   // const [gameOver, setGameOver] = useState(new Audio('assets/audio/gameOver_theme.mp3'));

//   const gameAreaRef = useRef(null);
//   const scoreRef = useRef(null);
//   const fuelBarRef = useRef(null);
//   const carRef = useRef(null);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       e.preventDefault();
//       setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
//     };

//     const handleKeyUp = (e) => {
//       e.preventDefault();
//       setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('keyup', handleKeyUp);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useEffect(() => {
//     if (player.start) {
//       // gameStart.play();
//       // gameStart.loop = true;
//       window.requestAnimationFrame(gamePlay);
//       createFuelBar();
//       initializeGameArea();
//     }
//   }, [player.start]);

//   const initializeGameArea = () => {
//     const gameArea = gameAreaRef.current;
//     gameArea.innerHTML = '';

//     for (let i = 0; i < 5; i++) {
//       let roadLineElement = document.createElement('div');
//       roadLineElement.setAttribute('class', 'roadLines');
//       roadLineElement.y = i * 150;
//       roadLineElement.style.top = roadLineElement.y + 'px';
//       gameArea.appendChild(roadLineElement);
//     }

//     let carElement = document.createElement('div');
//     carElement.setAttribute('class', 'car');
//     gameArea.appendChild(carElement);
//     carRef.current = carElement;

//     setPlayer((prevPlayer) => ({
//       ...prevPlayer,
//       x: carElement.offsetLeft,
//       y: carElement.offsetTop,
//     }));

//     for (let i = 0; i < 3; i++) {
//       let enemyCar = document.createElement('div');
//       enemyCar.setAttribute('class', 'enemyCar');
//       enemyCar.y = (i + 1) * 350 * -1;
//       enemyCar.style.top = enemyCar.y + 'px';
//       enemyCar.style.backgroundColor = randomColor();
//       enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
//       gameArea.appendChild(enemyCar);
//     }
//   };

//   const randomColor = () => {
//     const c = () => {
//       let hex = Math.floor(Math.random() * 256).toString(16);
//       return ('0' + String(hex)).substr(-2);
//     };
//     return '#' + c() + c() + c();
//   };

//   const onCollision = (a, b) => {
//     const aRect = a.getBoundingClientRect();
//     const bRect = b.getBoundingClientRect();

//     return !(
//       aRect.top > bRect.bottom ||
//       aRect.bottom < bRect.top ||
//       aRect.right < bRect.left ||
//       aRect.left > bRect.right
//     );
//   };

//   const onGameOver = () => {
//     setPlayer((prevPlayer) => ({ ...prevPlayer, start: false }));
//     // gameStart.pause();
//     // gameOver.play();
//     const startScreen = document.querySelector('.startScreen');
//     startScreen.classList.remove('hide');
//     startScreen.innerHTML = `Game Over <br> Your final score is ${player.score}<br> Press here to restart the game.`;
//   };

//   const moveRoadLines = () => {
//     const roadLines = document.querySelectorAll('.roadLines');
//     roadLines.forEach((item) => {
//       if (item.y >= 700) {
//         item.y -= 750;
//       }
//       item.y += player.speed;
//       item.style.top = item.y + 'px';
//     });
//   };

//   const moveEnemyCars = (carElement) => {
//     const enemyCars = document.querySelectorAll('.enemyCar');
//     enemyCars.forEach((item) => {
//       if (onCollision(carElement, item)) {
//         onGameOver();
//       }
//       if (item.y >= 750) {
//         item.y = -300;
//         item.style.left = Math.floor(Math.random() * 350) + 'px';
//       }
//       item.y += player.speed;
//       item.style.top = item.y + 'px';
//     });
//   };

//   const createItem = () => {
//     let item = document.createElement('div');
//     item.setAttribute('class', 'item');
//     item.y = -300;
//     item.style.top = item.y + 'px';
//     item.style.left = Math.floor(Math.random() * 350) + 'px';
//     if (Math.random() < 0.7) {
//       item.classList.add('fuelCan');
//     } else {
//       item.classList.add('timeSlower');
//     }
//     gameAreaRef.current.appendChild(item);
//   };

//   const moveItems = (carElement) => {
//     const items = document.querySelectorAll('.item');
//     items.forEach((item) => {
//       if (onCollision(carElement, item)) {
//         if (item.classList.contains('timeSlower')) {
//           activateTimeSlower();
//         } else if (item.classList.contains('fuelCan')) {
//           collectFuel();
//         }
//         item.remove();
//       }
//       if (item.y >= 750) {
//         item.remove();
//       }
//       item.y += player.speed;
//       item.style.top = item.y + 'px';
//     });
//   };

//   const activateTimeSlower = () => {
//     const originalSpeed = player.speed;
//     setPlayer((prevPlayer) => ({ ...prevPlayer, speed: prevPlayer.speed / 2 }));
//     setTimeout(() => {
//       setPlayer((prevPlayer) => ({ ...prevPlayer, speed: originalSpeed }));
//     }, 5000);
//   };

//   const collectFuel = () => {
//     setPlayer((prevPlayer) => ({
//       ...prevPlayer,
//       fuel: Math.min(prevPlayer.fuel + 20, 100),
//     }));
//   };

//   const updateFuel = () => {
//     setPlayer((prevPlayer) => {
//       const newFuel = prevPlayer.fuel - 0.1;
//       if (newFuel <= 0) {
//         onGameOver();
//         return { ...prevPlayer, fuel: 0 };
//       }
//       return { ...prevPlayer, fuel: newFuel };
//     });
//   };

//   const drawFuelBar = () => {
//     const fuelBar = fuelBarRef.current;
//     fuelBar.style.width = player.fuel + '%';
//   };

//   const createFuelBar = () => {
//     const fuelBar = document.createElement('div');
//     fuelBar.classList.add('fuelBar');
//     document.querySelector('.carGame').appendChild(fuelBar);
//     fuelBarRef.current = fuelBar;
//   };

//   const gamePlay = () => {
//     const carElement = carRef.current;
//     const road = gameAreaRef.current.getBoundingClientRect();

//     if (player.start) {
//       moveRoadLines();
//       moveEnemyCars(carElement);
//       moveItems(carElement);

//       if (keys.ArrowUp && player.y > road.top + 70)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y - prevPlayer.speed }));
//       if (keys.ArrowDown && player.y < road.bottom - 85)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y + prevPlayer.speed }));
//       if (keys.ArrowLeft && player.x > 0)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x - prevPlayer.speed }));
//       if (keys.ArrowRight && player.x < road.width - 70)
//         setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x + prevPlayer.speed }));

//       carElement.style.top = player.y + 'px';
//       carElement.style.left = player.x + 'px';

//       updateFuel();
//       drawFuelBar();

//       window.requestAnimationFrame(gamePlay);

//       setPlayer((prevPlayer) => ({
//         ...prevPlayer,
//         score: prevPlayer.score + 1,
//       }));

//       if (Math.random() < 0.02) {
//         createItem();
//       }
//     }
//   };

//   const startGame = () => {
//     document.querySelector('.startScreen').classList.add('hide');
//     setPlayer((prevPlayer) => ({ ...prevPlayer, start: true, score: 0, fuel: 100 }));
//   };

//   return (
//     <div className='carGame'>
//       <div className='startScreen' onClick={startGame}>
//         Press to Start
//       </div>
//       <div className='gameArea' ref={gameAreaRef}></div>
//       <div className='score' ref={scoreRef}></div>
//       <div className='fuelBar' ref={fuelBarRef}></div>
//       <div className='level'>
//         <button
//           id='easy'
//           onClick={(e) =>
//             setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed[e.target.id] }))
//           }
//         >
//           Easy
//         </button>
//         <button
//           id='moderate'
//           onClick={(e) =>
//             setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed[e.target.id] }))
//           }
//         >
//           Moderate
//         </button>
//         <button
//           id='difficult'
//           onClick={(e) =>
//             setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed[e.target.id] }))
//           }
//         >
//           Difficult
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Game;


//@@------------------------------


// import React, { useEffect, useRef, useState } from 'react';

// const Game = () => {
//   const [player, setPlayer] = useState({ speed: 7, score: 0, fuel: 100, start: false, x: 0, y: 0 });
//   const [keys, setKeys] = useState({
//     ArrowUp: false,
//     ArrowDown: false,
//     ArrowLeft: false,
//     ArrowRight: false
//   });
//   const [levelSpeed] = useState({ easy: 7, moderate: 10, difficult: 14 });
//   // const gameStart = useRef(new Audio('assets/audio/game_theme.mp3'));
//   // const gameOver = useRef(new Audio('assets/audio/gameOver_theme.mp3'));

//   const gameAreaRef = useRef(null);
//   const scoreRef = useRef(null);
//   const fuelBarRef = useRef(null);
//   const carRef = useRef(null);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       e.preventDefault();
//       setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
//     };

//     const handleKeyUp = (e) => {
//       e.preventDefault();
//       setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('keyup', handleKeyUp);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useEffect(() => {
//     if (player.start) {
//       // gameStart.current.play();
//       // gameStart.current.loop = true;
//       window.requestAnimationFrame(gamePlay);
//       createFuelBar();
//       initializeGameArea();
//     }
//   }, [player.start]);

//   const initializeGameArea = () => {
//     const gameArea = gameAreaRef.current;
//     gameArea.innerHTML = '';

//     for (let i = 0; i < 5; i++) {
//       let roadLineElement = document.createElement('div');
//       roadLineElement.setAttribute('class', 'roadLines');
//       roadLineElement.y = i * 150;
//       roadLineElement.style.top = roadLineElement.y + 'px';
//       gameArea.appendChild(roadLineElement);
//     }

//     let carElement = document.createElement('div');
//     carElement.setAttribute('class', 'car');
//     gameArea.appendChild(carElement);
//     carRef.current = carElement;

//     setPlayer((prevPlayer) => ({
//       ...prevPlayer,
//       x: carElement.offsetLeft,
//       y: carElement.offsetTop
//     }));

//     for (let i = 0; i < 3; i++) {
//       let enemyCar = document.createElement('div');
//       enemyCar.setAttribute('class', 'enemyCar');
//       enemyCar.y = (i + 1) * 350 * -1;
//       enemyCar.style.top = enemyCar.y + 'px';
//       enemyCar.style.backgroundColor = randomColor();
//       enemyCar.style.left = Math.floor(Math.random() * 350) + 'px';
//       gameArea.appendChild(enemyCar);
//     }
//   };

//   const randomColor = () => {
//     const c = () => {
//       let hex = Math.floor(Math.random() * 256).toString(16);
//       return ('0' + String(hex)).substr(-2);
//     };
//     return '#' + c() + c() + c();
//   };

//   const onCollision = (a, b) => {
//     const aRect = a.getBoundingClientRect();
//     const bRect = b.getBoundingClientRect();

//     return !(
//       aRect.top > bRect.bottom ||
//       aRect.bottom < bRect.top ||
//       aRect.right < bRect.left ||
//       aRect.left > bRect.right
//     );
//   };

//   const onGameOver = () => {
//     setPlayer((prevPlayer) => ({ ...prevPlayer, start: false }));
//     // gameStart.current.pause();
//     // gameOver.current.play();
//     const startScreen = document.querySelector('.startScreen');
//     startScreen.classList.remove('hide');
//     startScreen.innerHTML = `Game Over <br> Your final score is ${player.score}<br> Press here to restart the game.`;
//   };

//   const moveRoadLines = () => {
//     const roadLines = document.querySelectorAll('.roadLines');
//     roadLines.forEach((item) => {
//       if (item.y >= 700) {
//         item.y -= 750;
//       }
//       item.y += player.speed;
//       item.style.top = item.y + 'px';
//     });
//   };

//   const moveEnemyCars = (carElement) => {
//     const enemyCars = document.querySelectorAll('.enemyCar');
//     enemyCars.forEach((item) => {
//       if (onCollision(carElement, item)) {
//         onGameOver();
//       }
//       if (item.y >= 750) {
//         item.y = -300;
//         item.style.left = Math.floor(Math.random() * 350) + 'px';
//       }
//       item.y += player.speed;
//       item.style.top = item.y + 'px';
//     });
//   };

//   const createItem = () => {
//     let item = document.createElement('div');
//     item.setAttribute('class', 'item');
//     item.y = -300;
//     item.style.top = item.y + 'px';
//     item.style.left = Math.floor(Math.random() * 350) + 'px';
//     if (Math.random() < 0.7) {
//       item.classList.add('fuelCan');
//     } else {
//       item.classList.add('timeSlower');
//     }
//     gameAreaRef.current.appendChild(item);
//   };

//   const moveItems = (carElement) => {
//     const items = document.querySelectorAll('.item');
//     items.forEach((item) => {
//       if (onCollision(carElement, item)) {
//         if (item.classList.contains('timeSlower')) {
//           activateTimeSlower();
//         } else if (item.classList.contains('fuelCan')) {
//           collectFuel();
//         }
//         item.remove();
//       }
//       if (item.y >= 750) {
//         item.remove();
//       }
//       item.y += player.speed;
//       item.style.top = item.y + 'px';
//     });
//   };

//   const activateTimeSlower = () => {
//     const originalSpeed = player.speed;
//     setPlayer((prevPlayer) => ({ ...prevPlayer, speed: prevPlayer.speed / 2 }));
//     setTimeout(() => {
//       setPlayer((prevPlayer) => ({ ...prevPlayer, speed: originalSpeed }));
//     }, 5000);
//   };

//   const collectFuel = () => {
//     setPlayer((prevPlayer) => ({
//       ...prevPlayer,
//       fuel: Math.min(prevPlayer.fuel + 20, 100)
//     }));
//   };

//   const updateFuel = () => {
//     setPlayer((prevPlayer) => {
//       const newFuel = prevPlayer.fuel - 0.1;
//       if (newFuel <= 0) {
//         onGameOver();
//         return { ...prevPlayer, fuel: 0 };
//       }
//       return { ...prevPlayer, fuel: newFuel };
//     });
//   };

//   const drawFuelBar = () => {
//     const fuelBar = fuelBarRef.current;
//     if (fuelBar) {
//       fuelBar.style.width = player.fuel + '%';
//     }
//   };

//   const createFuelBar = () => {
//     const fuelBar = document.createElement('div');
//     fuelBar.classList.add('fuelBar');
//     document.querySelector('.carGame').appendChild(fuelBar);
//     fuelBarRef.current = fuelBar;
//   };

//   const gamePlay = () => {
    
//     const carElement = carRef.current;
//     const road = gameAreaRef.current.getBoundingClientRect();
//     // console.log(player);
//     // console.log(keys);
//     if (player.start) {
//       moveRoadLines();
//       moveEnemyCars(carElement);
//       moveItems(carElement);

//       if (keys.ArrowUp){
//         console.log('up button pressed  ' + player.y);
//       }
      
//       if (keys.ArrowUp) setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y - 10 }));
//       if (keys.ArrowDown) setPlayer((prevPlayer) => ({ ...prevPlayer, y: prevPlayer.y + 10 }));
//       if (keys.ArrowLeft) setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x - 10 }));
//       if (keys.ArrowRight) setPlayer((prevPlayer) => ({ ...prevPlayer, x: prevPlayer.x + 10 }));

//       carElement.style.top = player.y + 'px';
//       carElement.style.left = player.x + 'px';

//       updateFuel();
//       drawFuelBar();

//       window.requestAnimationFrame(gamePlay);

//       setPlayer((prevPlayer) => ({
//         ...prevPlayer,
//         score: prevPlayer.score + 1
//       }));

//       if (Math.random() < 0.02) {
//         createItem();
//       }
//     }
//   };

//   const startGame = () => {
//     document.querySelector('.startScreen').classList.add('hide');
//     setPlayer((prevPlayer) => ({ ...prevPlayer, start: true, score: 0, fuel: 100 }));
//   };

//   return (
//     <div className="carGame">
//       <div className="startScreen" onClick={startGame}>
//         Press to Start
//       </div>
//       <div className="gameArea" ref={gameAreaRef}></div>
//       <div className="score" ref={scoreRef}>Score: {player.score}</div>
//       <div className="fuelBar" ref={fuelBarRef}></div>
//       <div className="level">
//         <button id="easy" onClick={(e) => setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed[e.target.id] }))}>
//           Easy
//         </button>
//         <button id="moderate" onClick={(e) => setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed[e.target.id] }))}>
//           Moderate
//         </button>
//         <button id="difficult" onClick={(e) => setPlayer((prevPlayer) => ({ ...prevPlayer, speed: levelSpeed[e.target.id] }))}>
//           Difficult
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Game;


import React, { useRef, useEffect } from 'react';

const GameComponent = () => {
  const gameAreaRef = useRef(null);
  const scoreRef = useRef(null);
  const fuelBarRef = useRef(null);
  const startScreenRef = useRef(null);
  const levelRef = useRef(null);

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
      player.speed = levelSpeed[e.target.id];
    });

    startScreen.addEventListener('click', startGame);

    function startGame() {
      startScreen.classList.add('hide');
      gameArea.innerHTML = '';

      player.start = true;
      player.score = 0;
      player.fuel = 100;
      gameStart.play();
      gameStart.loop = true;
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
    }

    function randomColor() {
      function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ('0' + String(hex)).substr(-2);
      }
      return '#' + c() + c() + c();
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
      gameStart.pause();
      gameOver.play();
      startScreen.classList.remove('hide');
      startScreen.innerHTML =
        'Game Over <br> Your final score is ' +
        player.score +
        '<br> Press here to restart the game.';
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

    function createItem() {
      let item = document.createElement('div');
      item.setAttribute('class', 'item');
      item.y = -300;
      item.style.top = item.y + 'px';
      item.style.left = Math.floor(Math.random() * 350) + 'px';
      if (Math.random() < 0.7) {
        item.classList.add('fuelCan');
      } else {
        item.classList.add('timeSlower');
      }
      gameArea.appendChild(item);
    }

    function moveItems(carElement) {
      let items = document.querySelectorAll('.item');
      items.forEach((item) => {
        if (onCollision(carElement, item)) {
          if (item.classList.contains('timeSlower')) {
            activateTimeSlower();
          } else if (item.classList.contains('fuelCan')) {
            collectFuel();
          }
          item.remove();
        }
        if (item.y >= 750) {
          item.remove();
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
      });
    }

    function activateTimeSlower() {
      let originalSpeed = player.speed;
      player.speed = player.speed / 2;
      setTimeout(() => {
        player.speed = originalSpeed;
      }, 5000);
    }

    function collectFuel() {
      player.fuel = Math.min(player.fuel + 20, 100);
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
      let road = gameArea.getBoundingClientRect();

      if (player.start) {
        moveRoadLines();
        moveEnemyCars(carElement);
        moveItems(carElement);

        if (keys.ArrowUp && player.y > road.top + 70) player.y -= player.speed;
        if (keys.ArrowDown && player.y < road.bottom - 85) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - 70) player.x += player.speed;

        carElement.style.top = player.y + 'px';
        carElement.style.left = player.x + 'px';

        updateFuel();
        drawFuelBar();

        window.requestAnimationFrame(gamePlay);

        player.score++;
        const ps = player.score - 1;
        score.innerHTML = 'Score: ' + ps;
        fuelBar.innerHTML = 'Fuel: ' + player.fuel;

        if (Math.random() < 0.02) {
          createItem();
        }
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
        <button id="easy">Easy</button>
        <button id="moderate">Moderate</button>
        <button id="difficult">Difficult</button>
      </div>
      <div ref={gameAreaRef} className="gameArea"></div>
    </div>
  );
};

export default GameComponent;
