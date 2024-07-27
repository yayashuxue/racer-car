import { Box, Button, Menu, MenuItem, styled, useMediaQuery, useTheme } from '@mui/material';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import React, { useEffect, useState } from 'react';
import { useGetEnsDetail } from 'src/hook/useEnsDetail';
import Image from 'next/image';
import { useChipUnit } from 'src/hook/useChipUnit';
import { useGetGlobalChip } from 'src/hook/useGetGlobalChip';
import BigNumber from 'bignumber.js';
import { useDisconnect } from 'wagmi';
import { useSnackBar } from 'src/hook/useSnackBar';
import { useTokenBalance } from 'src/apihook/useTokenBalance';
import router from 'next/router';
import { ethers } from 'ethers';
import ConnectTwitterDialog from './ConnectTwitterDialog';
import {apiUrl} from 'config';
import {updateUser} from 'pages/profile';
import {baseSepolia} from 'viem/chains';

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => (theme.palette.mode === 'light' ? '#6999FF' : '#000205')};
  color: ${({ theme }) => (theme.palette.mode === 'light' ? 'black' : 'white')};
  border-radius: 8px;
`;

const StyledMenuItem = styled(MenuItem)`
  background-color: ${({ theme }) => (theme.palette.mode === 'light' ? 'white' : 'black')};
  color: ${({ theme }) => (theme.palette.mode === 'light' ? 'black' : 'white')};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => (theme.palette.mode === 'light' ? 'black' : 'white')};

  &:hover {
    background-color: ${({ theme }) => (theme.palette.mode === 'light' ? 'black' : 'white')};
    color: ${({ theme }) => (theme.palette.mode === 'light' ? 'white' : 'black')};
  }
`;

export const CustomConnectButton = () => {
  const { login, ready, authenticated, logout, user } = usePrivy();
  // console.log(user);
  const { wallets } = useWallets();
  const { showSuccess } = useSnackBar();

  
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  const { displayName } = useGetEnsDetail();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { disconnect } = useDisconnect();

  const isLightTheme = theme.palette.mode === 'light';
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buttonRef = React.useRef(null);

  const tokenBalance = useTokenBalance(user?.wallet?.address ?? '');
  const [ethBalance, setEthBalance] = useState(new BigNumber(0));
  const [dialogShown, setDialogShown] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallets.length > 0) {
        const provider = await wallets[0].getEthersProvider();
        const balance = await provider.getBalance(user?.wallet?.address ?? "");
        setEthBalance(new BigNumber(balance.toString()).div(1e18));
      }
    };

    const connectWallet = async () => {
      if (ready && authenticated && user?.wallet) {
        const json = {
          address: user?.wallet?.address,
          x_account: user?.twitter?.username,
          referrerAddress: null,
        };
        console.log('connectWallet User:', user);
        try {
          let response = await fetch(`${apiUrl}/isNewUser/${user.wallet.address}`);
          const data = await response.json();

          // If user is new, open referral dialog
          if (data.isNewUser) {
            // Add user if they are new
            response = await fetch(`${apiUrl}/createUser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(json),
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
          }
          
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };


    if (ready && authenticated) {
      fetchBalance();
      if (wallets && wallets[0] && Number(wallets[0].chainId) !== baseSepolia.id) {
        wallets[0].switchChain(baseSepolia.id);
      }
      connectWallet();
    }
  }, [ready, authenticated, wallets, user]);


  useEffect(() => {
    if (ready && authenticated && !user?.twitter && !localStorage.getItem('dialogShown')) {
      setDialogShown(true);
      localStorage.setItem('dialogShown', 'true');
    }
  }, [ready, authenticated, user]);

  useEffect(() => {
    const updateUserIfTwitterExists = async () => {
      if (
        authenticated &&
        ready && 
        user?.twitter &&
          user &&
          user.wallet &&
          user.wallet.address !== '0x' &&
          user.wallet.address != ''
      ) {
        try {
          
          
          await updateUser(user?.wallet?.address, user?.twitter.username);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    updateUserIfTwitterExists();
  }, [authenticated, ready, user?.twitter, user?.wallet?.address]); 

  const closeDialog = () => {
    setDialogShown(false);
  };

  useEffect(() => {
    if (!ready || !authenticated) {
      login();
    }
  }, []);
  if (!ready || !authenticated) {
    return (
      <StyledButton
        onClick={login}
        type='button'
        variant='contained'
        sx={{
          boxShadow: theme.palette.mode === 'light' ? '0px 4px black' : '0 4px #0052FF',
          fontSize: '14px',
        }}
      >
        Connect Wallet
      </StyledButton>
    );
  } else {
    return (
      <Box>
        <StyledButton
          ref={buttonRef}
          onClick={() => {
            setAnchorEl(buttonRef.current);
            // handleClick(e);
          }}
          type='button'
          variant='contained'
          sx={{
            width: '118px', // Fixed width
            height: '29px', // Hug height
            justifyContent: 'space-between', // Justify content
            padding: '4px 8px', // Padding
            boxShadow: open
              ? 'none'
              : theme.palette.mode === 'light'
              ? '0px 4px black'
              : '0 4px #0052FF',
            display: 'flex',
            alignItems: 'center',
          }}
          endIcon={
            ' ⛽️'
          }
        >
          {tokenBalance}
        </StyledButton>
        <Menu
          id='basic-menu'
          anchorEl={buttonRef.current}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            sx: { pt: '2px', background: 'transparent' },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                background: 'transparent',
                boxShadow: 'none',
                width: '118px',
              },
            },
          }}
        >
          {isMobile && (
            <StyledMenuItem
              onClick={() => {
                router.push('/profile');
                handleClose();
              }}
              sx={{
                fontSize: '14px',
                width: '118px', // Fixed width
                height: '29px', // Hug height
                justifyContent: 'space-between', // Justify content
                padding: '4px 8px', // Padding
              }}
            >
              Profile
            </StyledMenuItem>
          )}
          <StyledMenuItem
            onClick={() => {
              handleClose();
              navigator.clipboard.writeText(user?.wallet?.address ?? '');
              showSuccess('Copied to clipboard');
            }}
            sx={{
              fontSize: '14px',
              width: '118px', // Fixed width
              height: '29px', // Hug height
              justifyContent: 'space-between', // Justify content
              padding: '4px 8px', // Padding
            }}
          >
            {displayName}
          </StyledMenuItem>

          <StyledMenuItem
            onClick={handleClose}
            sx={{
              fontSize: '14px',
              width: '118px', // Fixed width
              height: '29px', // Hug height
              justifyContent: 'space-between', // Justify content
              padding: '4px 8px', // Padding
            }}
          >
            {ethBalance.toFixed(3).toString()} ETH
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => {
              localStorage.removeItem('dialogShown');
              logout();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              width: '118px', // Fixed width
              height: '29px', // Hug height
              // justifyContent: 'space-between', // Justify content
              padding: '4px 8px',
              boxShadow: theme.palette.mode === 'light' ? '0px 4px black' : '0 4px #0052FF',
            }}
          >
            DISCONNECT
          </StyledMenuItem>
        </Menu>
        <ConnectTwitterDialog open={dialogShown} close={closeDialog} />
      </Box>
    );
  }
};
