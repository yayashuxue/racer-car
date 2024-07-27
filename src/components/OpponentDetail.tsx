import { Avatar, Box, Typography } from '@mui/material';
import { useGetEnsDetailByAddress } from 'src/hook/useEnsDetail';
import { maskAddress } from 'src/utils/maskAddress';
import Image from 'next/image';
import { ProfilePicture } from 'src/components/ProfilePicture';
import BigNumber from 'bignumber.js';
import {useEffect, useState} from 'react';
import {apiUrl} from 'config';

export const OpponentDetail = ({
  address,
  isDealer = false,
  isUserTurn = false,
  isGamePlayPage = true,
}: {
  address: `0x${string}`;
  isDealer: boolean;
  isUserTurn: boolean;
  isGamePlayPage: boolean;
}) => {
  const { displayName, avatar } = useGetEnsDetailByAddress({ address });
  const digit = parseInt(address[address.length - 1], 16) % 4;
  const [twitter, setTwitter] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/getUser/${address}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTwitter(data.x_account);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    if (address) {
      fetchUser();
    }
  }, [address]);

 return (
   <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
     <ProfilePicture
       avatar={(avatar as string) ?? `/${digit}-opponent.png`}
       isDealer={isDealer}
       isUserTurn={isUserTurn}
     />
     <Typography color='textPrimary'>{displayName}</Typography>
     {/* <Typography color='textPrimary'> */}
       {isGamePlayPage && twitter ? (
        <Box component='span' color='success.main'>
          <a href={`https://twitter.com/${twitter}`} target='_blank' rel='noopener noreferrer'>
            {maskAddress(`@${twitter}`)}
          </a>
        </Box>
      ) : null}
     {/* </Typography> */}
   </Box>
 );
};