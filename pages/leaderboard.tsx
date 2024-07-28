import { Box, Button, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { LeaderboardData, LeaderboardTable } from 'src/components/Table';
import { Title } from 'src/components/Title';
import { useRouter } from 'next/router';
import { apiUrl } from 'config';

const Home: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<LeaderboardData[]>([]);
  useEffect(() => {
    fetch(`/api/leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Transform the data to match the expected structure
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }, []);

  return (
    <Box>
      {/* <Head>
        <title>Lobby</title>
        <meta content='Poker' name='description' />
        <link href='/favicon.ico' rel='icon' />
      </Head> */}
      <Box display='flex' justifyContent='center'>
        <Box width={{ xs: '100%', md: '50%' }} textAlign='center'>
          <Title>Leader board</Title>
          <Box mt={2}>
            <LeaderboardTable data={data} />
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap={2}
            my={3}
          >
            <Button
              variant='contained'
              onClick={() => {
                router.push('/');
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
