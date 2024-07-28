import { Box, Button, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import AnimatedCard from 'src/components/AnimatedCard';
import StaticCard from 'src/components/StaticCard';
import { OpponentDetail } from 'src/components/OpponentDetail';
import { useTokenBalance } from 'src/apihook/useTokenBalance';
import styles from 'styles/Home.module.css';
import { FixedSizeGrid as Grid } from 'react-window';
import { baseSepolia } from 'viem/chains';
import { apiUrl } from 'config';
import { useSnackBar } from 'src/hook/useSnackBar';

const mapRarity = (rarity: string): 'Common' | 'Rare' | 'Epic' | 'Legendary' => {
  const rarityValue = parseInt(rarity, 10);
  if (rarityValue <= 50) {
    return 'Common';
  } else if (rarityValue <= 80) {
    return 'Rare';
  } else if (rarityValue <= 95) {
    return 'Epic';
  } else {
    return 'Legendary';
  }
};

export interface NFTTableData {
  tokenId: string;
  cardNumber: number;
  rarity: string;
}
interface NFTTableProps {
  data: any; // replace with your data type
  setListNFTOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedNFTMetadata: React.Dispatch<React.SetStateAction<any>>;
}

export const updateUser = async (address: string, x_account: string | null) => {
  console.log('updateUser address:', address, 'x_account:', x_account);
  try {
    const response = await fetch(`${apiUrl}/updateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, x_account }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const NFTTableData: React.FC<NFTTableProps> = ({ data, setListNFTOpen, setOpenedNFTMetadata }) => {
  // Transform data into an array
  const dataArray = Object.entries(data)
    .map(([id, info]: [string, any]) => ({
      id,
      ...info,
    }))
    .sort((a, b) => Number(b.rarity) - Number(a.rarity)); // for descending order

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const row = dataArray[rowIndex * numColumns + columnIndex];
    if (!row) {
      return null; // Return null for cells that don't have corresponding data
    }
    return (
      <Box
        style={style}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // border: '1.5px solid',
          // borderRadius: 1,
        }}
        onClick={() => {
          setOpenedNFTMetadata(row);
          setListNFTOpen(true);
        }}
      >
        <StaticCard
          columnWidth={140}
          rowHeight={194}
          cardNumber={row.cardNumber}
          rarity={mapRarity(row.rarity)}
        ></StaticCard>
        <Typography color='textPrimary'>Rarity: {row.rarity}</Typography>
      </Box>
    );
  };

  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemWidth = 150; // Adjust based on the size of your cards
  const width = Math.min(windowDimensions.width * 0.9, 479); // 90% of the window width
  const numColumns = Math.floor(width / itemWidth);
  const numRows = Math.ceil(dataArray.length / numColumns);

  return (
    <Grid
      columnCount={numColumns}
      columnWidth={150} // Adjust based on the size of your cards
      height={windowDimensions.height * 0.6}
      rowCount={numRows}
      rowHeight={250} // Adjust based on the size of your cards
      width={width}
    >
      {Cell}
    </Grid>
  );
};

const Home: NextPage = () => {
  const router = useRouter();
  const { login, ready, authenticated, logout, user, unlinkTwitter, linkTwitter } = usePrivy();
  const [data, setData] = useState<any[]>([]);
  const { wallets } = useWallets();
  const wallet = user?.wallet;
  // Inside your component
  const addressFromUrl = router.query.address;

  const [address, setAddress] = useState('');
  const { showError } = useSnackBar();
  useEffect(() => {
    if (addressFromUrl) {
      setAddress(Array.isArray(addressFromUrl) ? addressFromUrl[0] : addressFromUrl);
    } else {
      if (ready && authenticated) setAddress(user?.wallet?.address ?? '');
    }
  }, [addressFromUrl, ready, authenticated, user]);

  useEffect(() => {
    if (address === '') {
      login();
    }
  }, [address]);

  useEffect(() => {
    const updateUserIfTwitterExists = async () => {
      if (
        authenticated &&
        ready &&
        user?.twitter &&
        user?.wallet?.address &&
        user?.wallet?.address !== '0x' &&
        user?.wallet?.address != ''
      ) {
        try {
          await updateUser(user?.wallet?.address, user?.twitter.username);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    updateUserIfTwitterExists();
  }, [authenticated, ready, user?.twitter, user]);

  useEffect(() => {
    if (wallets && wallets[0] && Number(wallets[0].chainId) !== baseSepolia.id) {
      wallets[0].switchChain(baseSepolia.id);
    }
  }, [wallets]);

  const [earningRate, setEarningRate] = useState<number>(0);
  const tokenBalance = useTokenBalance(address);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [listNFTOpen, setListNFTOpen] = useState(false);
  const [openedNFTMetadata, setOpenedNFTMetadata] = useState<any>({});
  const [twitter, setTwitter] = useState(null);

  useEffect(() => {
    if (address) {
      fetch(`${apiUrl}/getUserNFTs?address=${address}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error('Failed to fetch data:', error);
        });
    }
  }, [address]);

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
  }, [ready, authenticated, user?.twitter, address]);

  // const fetchEarningRate = async () => {
  //   const response = await fetch(`${apiUrl}/getEarningRate?address=${address}`);
  //   const data = await response.json();
  //   setEarningRate(data.data);
  // };
  // useEffect(() => {
  //   if (address && address !== '0x') {
  //     fetchEarningRate();
  //   }
  // }, [address]);
  if (address === '') {
    return (
      <div className={styles.profileContainer}>
        <Box>
          <Box display='flex' justifyContent='center'>
            <Box width={{ xs: '100%', md: '50%' }} textAlign='center'>
              <AnimatedCard cardNumber={-1} rarity={'Rare'} />

              <Typography>Connect Wallet To See Your Profile</Typography>
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
                    login();
                  }}
                >
                  Connect Wallet
                </Button>
                <Button
                  variant='outlined'
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
      </div>
    );
  }
  return (
    <div className={styles.profileContainer}>
      <Box>
        {/* <Head>
        <title>Lobby</title>
        <meta content='Poker' name='description' />
        <link href='/favicon.ico' rel='icon' />
      </Head> */}
        <Box display='flex' justifyContent='center'>
          <Box width={{ xs: '100%', md: '50%' }} textAlign='center'>
            {address && (
              <OpponentDetail
                address={address as `0x${string}`}
                isDealer={false}
                isUserTurn={false}
                isGamePlayPage={false}
              ></OpponentDetail>
            )}
            {twitter && (
              <Typography color='textPrimary'>
                Twitter:{' '}
                <Box component='span' color='success.main'>
                  <a
                    href={`https://twitter.com/${twitter}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    @{twitter}{' '}
                  </a>
                </Box>
              </Typography>
            )}
            {wallet?.address === address &&
              (user?.twitter ? (
                <Typography
                  color='textPrimary'
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to unlink?')) {
                      if (ready && authenticated && user.twitter)
                        try {
                          await unlinkTwitter(user?.twitter.subject ?? '');
                          await updateUser(wallet?.address, null);
                        } catch (error) {
                          showError((error as Error).message);
                        }
                    }
                  }}
                >
                  (<u>unlink</u>)
                </Typography>
              ) : (
                wallet?.address === address && (
                  <Typography
                    color='success.main'
                    onClick={async () => {
                      linkTwitter();
                    }}
                  >
                    <u>Link Twitter</u>
                  </Typography>
                )
              ))}

            <Typography color='textPrimary'>
              Score:{' '}
              <Box component='span' color='success.main'>
                {tokenBalance}
                🚗
              </Box>
            </Typography>

            <Box mt={2}>
              {Object.keys(data).length === 0 ? (
                <>
                  <AnimatedCard cardNumber={-1} rarity={'Rare'} />
                  <Typography fontSize={20} color='textPrimary'>
                    There isn&apos;t any NFT ... Yet
                  </Typography>
                </>
              ) : (
                <NFTTableData
                  data={data}
                  setListNFTOpen={setListNFTOpen}
                  setOpenedNFTMetadata={setOpenedNFTMetadata}
                />
              )}
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
    </div>
  );
};

export default Home;
