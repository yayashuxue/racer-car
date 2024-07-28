import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Title } from 'src/components/Title';
import { useRouter } from 'next/router';
import { useAccount, useBalance } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import AnimatedCard from 'src/components/AnimatedCard';
import StaticCard from 'src/components/StaticCard';
import { OpponentDetail } from 'src/components/OpponentDetail';
import styles from 'styles/Home.module.css';
import { FixedSizeGrid as Grid } from 'react-window';
import { set } from 'lodash';
import { baseSepolia } from 'viem/chains';
import { number } from 'zod';
import { apiUrl, config } from '../config';
import { BuyNFTDialog } from 'src/components/BuyNFTDialog';
import { stat } from 'fs';

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

const staticData = [
  {
    cost: 100,
    imageUrl: '/racer-car-elements/car-1.png',
    specialEffects: 'Effect 1',
    name: 'FORD',
  },
  {
    cost: 250,
    imageUrl: '/racer-car-elements/car-2.png',
    specialEffects: 'Effect 2',
    name: 'Truck',
  },
  {
    cost: 500,
    imageUrl: '/racer-car-elements/car-3.png',
    specialEffects: 'Effect 3',
    name: 'Honda 🐂',
  },
  {
    cost: 1000,
    imageUrl: '/racer-car-elements/car-4.png',
    specialEffects: 'Effect 3',
    name: 'Maybach',
  },
  {
    cost: 2000,
    imageUrl: '/racer-car-elements/car-5.png',
    specialEffects: 'Effect 5',
    name: 'Stretch Lincoln',
  },
  {
    cost: 3000,
    imageUrl: '/racer-car-elements/car-6.png',
    specialEffects: 'Effect 5',
    name: 'Bugatti',
  },
  {
    cost: 4000,
    imageUrl: '/racer-car-elements/car-7.png',
    specialEffects: 'Effect 5',
    name: 'Pagani',
  },
  {
    cost: 100000,
    imageUrl: '/racer-car-elements/car-8.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Nascar',
  },
  {
    cost: 1000,
    imageUrl: '/racer-car-elements/equipment-0.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Golden Alloy',
  },
  {
    cost: 2000,
    imageUrl: '/racer-car-elements/equipment-1.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Carbon Fiber',
  },
  {
    cost: 4000,
    imageUrl: '/racer-car-elements/equipment-2.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Turbo Boost',
  },
  {
    cost: 1000,
    imageUrl: '/racer-car-elements/fuel-0.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Golden Alloy',
  },
  {
    cost: 2000,
    imageUrl: '/racer-car-elements/fuel-1.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Carbon Fiber',
  },
  {
    cost: 4000,
    imageUrl: '/racer-car-elements/fuel-2.png',
    specialEffects: 'Legendary Effect, Earning * 2',
    name: 'Turbo Boost',
  },
  // Add more elements as needed
];

export interface NFTMarketPlaceData {
  tokenId: string;
  cardNumber: number;
  rarity: string;
}
interface NFTTableProps {
  data: Array<{
    name: ReactNode;
    cost: number;
    imageUrl: string;
    specialEffects: string;
  }>;
  setListNFTOpen: (open: boolean) => void;
  setOpenedNFTMetadata: (metadata: any) => void;
}

const NFTMarketPlaceData: React.FC<NFTTableProps> = ({
  data,
  setListNFTOpen,
  setOpenedNFTMetadata,
}) => {
  // Transform data into an array
  const dataArray = [...data].sort((a, b) => a.cost - b.cost);


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
        style={{ ...style, margin: '10px' }} // Add margin to create space between cells
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
        <img src={row.imageUrl} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
        <Typography color='textPrimary'>{row.name}</Typography>
        <Typography color='textPrimary'>{row.cost} UNQ</Typography>
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

  const itemWidth = 200; // Adjust based on the size of your cards
  const width = Math.min(windowDimensions.width * 0.9, 900); // 90% of the window width
  const numColumns = Math.floor(width / itemWidth);
  const numRows = Math.ceil(dataArray.length / numColumns);

  // Calculate the total width of all cells
  const totalCellWidth = numColumns * itemWidth;

  // Calculate the left and right padding to center the cells
  const paddingLeftRight = (width - totalCellWidth) / 2;

  return (
    <div
      style={{
        width: width,
        height: windowDimensions.height * 0.6, // Fixed height for vertical scrolling
        overflowY: 'auto', // Enable vertical scrolling
        overflowX: 'hidden', // Prevent horizontal scrolling
        paddingLeft: paddingLeftRight,
        paddingRight: paddingLeftRight,
      }}
    >
      <Grid
        
        columnCount={numColumns}
        columnWidth={itemWidth + 20} // Adjust column width to account for margin
        height={numRows * (250 + 20)} // Total height of all rows
        rowCount={numRows}
        rowHeight={250 + 20} // Adjust row height to account for margin
        width={width}
      >
        {Cell}
      </Grid>
    </div>
  );
};
const Home: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
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
      const response = await fetch(`${apiUrl}/airdrop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
        }),
      });

      if (!response.ok) {
        // Handle error
        console.error('Airdrop request failed');
      } else {
        // Refetch the balance after a successful airdrop
        refetch();
      }
    };

    // Only call airdrop if balance.data is loaded and balance is 0, and airdrop has not been requested yet
    if (balance.data && balance.data.value === BigInt(0) && !airdropRequested) {
      airdrop();
      setAirdropRequested(true);
    }
  }, [balance, airdropRequested, refetch]);

  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [listNFTOpen, setListNFTOpen] = useState(false);
  const [owner, setOwner] = useState(null);
  const [openedNFTMetadata, setOpenedNFTMetadata] = useState<any>({});

  useEffect(() => {
    setData(staticData);
  }, []);

  return (
    <Box>
      {/* <Head>
        <title>Lobby</title>
        <meta content='Poker' name='description' />
        <link href='/favicon.ico' rel='icon' />
      </Head> */}
      <Box display='flex' justifyContent='center'>
        <Box width={{ xs: '120%', md: '80%' }} textAlign='center'>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap={2}
            my={3}
          >
            <Title>Pit Lane</Title>
            <Box display='flex' justifyContent='center'>
              <Box width={'100%'} textAlign='center'>
                {/* <Box mt={2}> */}
                {Object.keys(data).length === 0 ? (
                  <>
                    <AnimatedCard cardNumber={-1} rarity={'Rare'} />
                    <Typography fontSize={20} color='textPrimary'>
                      There isn&apos;t any NFT ... Yet
                    </Typography>
                  </>
                ) : (
                  <NFTMarketPlaceData
                    data={data}
                    setListNFTOpen={setListNFTOpen}
                    setOpenedNFTMetadata={setOpenedNFTMetadata}
                  />
                )}

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
            <BuyNFTDialog
              setOwner={setOwner}
              row={openedNFTMetadata}
              open={listNFTOpen}
              handleClose={() => setListNFTOpen(false)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
