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
import { ShowCardDialog } from 'src/components/ShowCardDialog';

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
  const [data, setData] = useState<any>();
  // TODO - for dev use
  const { showSuccess, showError } = useSnackBar();
  const [showCardOpen, setShowCardOpen] = useState(false);
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
      try {
        const response = await fetch(`/api/distribute-nft?address=${address}`, {
          method: 'GET', // or 'POST' if your endpoint expects a POST request
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('succeed');

        const data = await response.json();
        setShowCardOpen(true);
        console.log(data); // Handle the response data as needed
        setData(data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    if (address && !airdropRequested) {
      console.log('here');
      airdrop();
      setAirdropRequested(true);
    }
  }, [address, airdropRequested]);

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
          <ShowCardDialog
            open={showCardOpen}
            handleClose={() => setShowCardOpen(false)}
            data={data}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
