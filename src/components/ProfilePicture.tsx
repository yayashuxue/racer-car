import { Avatar, Box, styled } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const BlinkAvatar = styled(Avatar)`
  &.blink {
    @keyframes blink {
      0% {
        box-shadow: 0px 0px 0px 0px #0052ff;
      }
      50% {
        box-shadow: 0px 0px 8px 4px #0052ff;
      }
      100% {
        box-shadow: 0px 0px 0px 0px #0052ff;
      }
    }

    @-webkit-keyframes blink {
      0% {
        box-shadow: 0px 0px 0px 0px #0052ff;
      }
      50% {
        box-shadow: 0px 0px 8px 4px #0052ff;
      }
      100% {
        box-shadow: 0px 0px 0px 0px #0052ff;
      }
    }

    -webkit-animation: blink 1.5s linear infinite;
    -moz-animation: blink 1.5s linear infinite;
    -ms-animation: blink 1.5s linear infinite;
    -o-animation: blink 1.5s linear infinite;
    animation: blink 1.5s linear infinite;
    background: 'red';
  }
`;
export const ProfilePicture = ({
  avatar,
  isDealer = false,
  avatarSx,
  isUserTurn = false,
}: {
  avatar: string;
  isDealer: boolean;
  avatarSx?: any;
  isUserTurn?: boolean;
}) => {
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    if (isUserTurn) {
      setTimer(20);
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isUserTurn]);

  return (
    <Box position='relative'>
      {isDealer && (
        <Image
          width={20}
          height={20}
          alt='dealer'
          src='/dealer.png'
          style={{
            borderRadius: '50%',
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#0052FF',
            zIndex: 2,
          }}
        />
      )}
      <Box position='relative'>
        <BlinkAvatar
          className={isUserTurn ? 'blink' : ''}
          src={avatar}
          sx={{ m: 'auto', width: 50, height: 50, ...avatarSx }}
        ></BlinkAvatar>
        {isUserTurn && (
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
              color: 'white', // white text
              padding: '5px', // some padding
              borderRadius: '5px', // rounded corners
            }}
          >
            {timer}
          </Box>
        )}
      </Box>
    </Box>
  );
};
