import { Box, Button, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { LobbyTable } from 'src/components/Table';
import { useAccount, useBalance } from 'wagmi';
import { apiUrl, config } from '../config';
import { CONTRACT_ADDRESS, WAGMI_ABI } from '../src/constants';
import { useFetchTables } from '../src/apihook/useFetchTables';

import { Title } from 'src/components/Title';
import { useSnackBar } from 'src/hook/useSnackBar';
import { useRouter } from 'next/router';
// import {WithdrawGlobalChipDialog} from 'src/components/WithdrawGlobalChipDialog';
import { usePrivy, useWallets } from '@privy-io/react-auth';

export type TableData = {
  tableId: number;
  players: number;
  status: string;
  bbSize: any;
  buyInAmount: any;
  // action: string;
};



const Home: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<TableData[]>([]);
  // TODO - for dev use
  const { showSuccess, showError } = useSnackBar();
  const [open, setOpen] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openGetToken, setOpenGetToken] = useState(false);
  const [buyChipOpen, setBuyChipOpen] = useState(false);
  // const balance = useBalance({ address: address, chainId: config.chains[0].id });
  // const { refetch } = balance;
  const hasSetOpenGetTokenBeenCalled = useRef(false);

  const { isLoading, fetchTables } = useFetchTables(setData);
  const { user } = usePrivy();
  const address = user?.wallet?.address;

  const balance = useBalance({ address: address as `0x${string}`, chainId: config.chains[0].id });
  const { refetch } = balance;

  const [airdropRequested, setAirdropRequested] = useState(false);

  useEffect(() => {
    setAirdropRequested(false);
  }, [address]);

  useEffect(() => {
    const airdrop = async () => {
      // showSuccess('Airdropping base Sepolia UNQ...');
      // const response = await fetch(`${apiUrl}/airdrop`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     address: address,
      //   }),
      // });

      // if (!response.ok) {
      //   // Handle error
      //   console.error('Airdrop request failed');
      // } else {
      //   // Refetch the balance after a successful airdrop
      //   refetch();
      // }
    };

    // Only call airdrop if balance.data is loaded and balance is 0, and airdrop has not been requested yet
    if (balance.data && balance.data.value === BigInt(0) && !airdropRequested) {
      console.log('airdropping....');
      airdrop();
      setAirdropRequested(true);
    }
  }, [balance, airdropRequested, refetch]);


  return (
    <Box>
      {/* <Head>
        <title>Lobby</title>
        <meta content='Poker' name='description' />
        <link href='/favicon.ico' rel='icon' />
      </Head> */}
      <Box display='flex' justifyContent='center'>
        <Box width={{ xs: '100%', md: '50%' }} textAlign='center'>
          <Title>Rac3r</Title>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap={2}
            my={3}
          >
            <img
              src='/racer-car.gif'
              alt='Racer Car'
              style={{ width: '150%', maxWidth: '900px' }}
            />
            <Typography fontSize={20} color='textPrimary'>
              Race your way to the top
            </Typography>
            {/* <Button
              variant='contained'
              style={{ width: '247px' }}
              onClick={() => {
                setOpenGetToken(true);
              }}
            >
              Get Test Token
            </Button> */}
            <Button
              variant='contained'
              style={{ width: '247px' }}
              onClick={() => {
                router.push('/leaderboard');
              }}
            >
              Leaderboard
            </Button>
            <Button
              variant='outlined'
              style={{ width: '247px' }}
              onClick={() => {
                router.push('/game');
              }}
            >
              Start Playing
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
