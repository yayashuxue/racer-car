import { Box, Button, Container, IconButton, styled, useTheme, useMediaQuery, Typography } from '@mui/material';
import { ColorModeContext } from 'pages/_app';
import { ReactNode, useContext, useEffect, useState } from 'react';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import Image from 'next/image';
import { CustomConnectButton } from 'src/components/ConnectButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { useGetPlayerState } from 'src/hook/useGetPlayerState';
import { useAccount } from 'wagmi';
import { useSnackBar } from 'src/hook/useSnackBar';
import socketIOClient from 'socket.io-client';

import Head from 'next/head';
import { getTableData } from 'pages/api/getTable';
import { apiUrl } from 'config';
import { usePrivy } from '@privy-io/react-auth';

interface LayoutProps {
  children: ReactNode;
}

const StyledButton = styled(Button)`
  &:hover {
    background: transparent;
    border: none;
    box-shadow: none;
  }
`;

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
  },
  '&:active': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    border: 'none',
  },
  ml: 1,
  background: 'transparent',
  boxShadow: 'none',
  border: 'none',
}));

export const Layout = ({ children }: LayoutProps) => {

  const { showSuccess, showError } = useSnackBar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { authenticated, user } = usePrivy();
  const address = user?.wallet?.address;
  const colorMode = useContext(ColorModeContext);
  const isLightTheme = theme.palette.mode === 'light';
  const router = useRouter();

  const { pathname, query } = router;

  const [isWatcher, setIsWatcher] = useState(true);
  const leaveGame = async (address: string, seatI: number) => {
    // TODO: Implement
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // if (process.env.NODE_ENV === 'development') {
    //   showSuccess('Left table successfully');
    // } else {
    //   showSuccess('Left table successfully');
    // }
  router.push('/');
  };


  const handleLeave = async () => {
      router.push('/');
      // TODO: add leaveGame
  };
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png' />
        <link rel='icon' type='image/png' sizes='512x512' href='/android-chrome-512x512.png' />
        <meta name='theme-color' content='#ffffff' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-config' content='/browserconfig.xml' />
      </Head>
      <Box
        minHeight={'100vh'}
        display={'flex'}
        flexDirection={'column'}
        sx={{
          background: isLightTheme ? 'white' : 'black',
        }}
      >
        <Box
          component='nav'
          bgcolor={isLightTheme ? 'white' : 'black'}
          sx={{ borderBottom: `1px solid ${isLightTheme ? 'black' : 'white'}` }}
        >
          <Box
            display='flex'
            justifyContent='space-between'
            p={2}
            alignItems='center'
            gap={2}
            flexDirection={'row-reverse'}
          >
            <Box display='flex' alignItems='center' gap={{ xs: 1, md: 2 }}>
              <StyledIconButton onClick={colorMode.toggleColorMode} color='inherit'>
                {isLightTheme ? (
                  <DarkModeIcon
                    sx={{
                      color: '#3D7AFB',
                    }}
                  />
                ) : (
                  <LightModeIcon sx={{ color: theme.palette.text.primary }} />
                )}
              </StyledIconButton>

              {/* <ConnectButton /> */}
              <CustomConnectButton />
            </Box>

            <Box>
              {pathname === '/game' && (
                <StyledButton
                  onClick={handleLeave}
                  variant='text'
                  type='button'
                  startIcon={
                    <Image
                      src={isLightTheme ? '/chevron-black.png' : '/chevron-white.png'}
                      width={12}
                      height={8}
                      alt='chevron'
                      style={{
                        transform: 'rotate(90deg)',
                      }}
                    />
                  }
                >
                  Leave
                </StyledButton>
              )}

              {pathname !== '/game' && (
                <StyledButton
                  onClick={() => {
                    router.push('/');
                  }}
                  variant='text'
                  type='button'
                >
                  🏠 Home
                </StyledButton>
              )}

              {!isMobile && pathname !== '/game' && (
                <StyledButton
                  onClick={() => {
                    router.push('/profile');
                  }}
                  variant='text'
                  type='button'
                >
                  😎 Profile
                </StyledButton>
              )}
              {!isMobile && pathname !== '/game' && (
                <StyledButton
                  onClick={() => {
                    router.push('/marketplace');
                  }}
                  variant='text'
                  type='button'
                >
                  🅿️ Pit
                </StyledButton>
              )}

              {!isMobile && pathname !== '/game' && (
                <StyledButton
                  onClick={() => {
                    router.push('/leaderboard');
                  }}
                  variant='text'
                  type='button'
                >
                  🏆 Leaderboard
                </StyledButton>
              )}
            </Box>
          </Box>
        </Box>
        <div style={{ paddingBottom: isMobile && pathname !== '/game' ? 'px' : '30px' }}>
          <Container
            maxWidth='lg'
            component='main'
            sx={{
              flex: 1,
              p: { xs: 2, md: 4 },
              overflow: 'auto',
            }}
          >
            {children}
          </Container>
        </div>
        {isMobile && pathname !== '/game' && (
          <Box
            component='nav'
            bgcolor={isLightTheme ? 'white' : 'black'}
            sx={{
              width: '100%',
              bottom: 0,
              position: 'fixed',
              borderTop: `1px solid ${isLightTheme ? 'black' : 'white'}`,
            }}
          >
            <Box
              display='flex'
              justifyContent='space-between'
              p={1}
              alignItems='center'
              gap={2}
              flexDirection={'column'}
            >
              <Box>
                <StyledButton
                  onClick={() => {
                    router.push('/game');
                  }}
                  variant='text'
                  type='button'
                  style={{ textTransform: 'none' }}
                >
                  🎮 Game
                </StyledButton>

                <StyledButton
                  onClick={() => {
                    router.push('/profile');
                  }}
                  variant='text'
                  type='button'
                  style={{ textTransform: 'none' }}
                >
                  😎 Profile
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    router.push('/marketplace');
                  }}
                  variant='text'
                  type='button'
                  style={{ textTransform: 'none' }}
                >
                  🅿️ Pit
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    router.push('/leaderboard');
                  }}
                  variant='text'
                  type='button'
                  style={{ textTransform: 'none' }}
                >
                  🏆 Leaderboard
                </StyledButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
// function showSuccess(arg0: string) {
//   throw new Error('Function not implemented.');
// }