import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Title } from 'src/components/Title';
import { useRouter } from 'next/router';
import {useAccount, useBalance} from 'wagmi';
import {usePrivy, useWallets} from '@privy-io/react-auth';
import AnimatedCard from 'src/components/AnimatedCard';
import StaticCard from 'src/components/StaticCard';
import { OpponentDetail } from 'src/components/OpponentDetail';
import styles from 'styles/Home.module.css';
import { FixedSizeGrid as Grid } from 'react-window';
import {set} from 'lodash';
import {baseSepolia} from 'viem/chains';
import {number} from 'zod';
import {apiUrl, config} from '../config';
import {BuyNFTDialog} from 'src/components/BuyNFTDialog';

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


export interface NFTMarketPlaceData {
  tokenId: string;
  cardNumber: number;
  rarity: string;
}
interface NFTTableProps {
  data: any; // replace with your data type
  setListNFTOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedNFTMetadata: React.Dispatch<React.SetStateAction<any>>;
  setOwner: React.Dispatch<React.SetStateAction<any>>;
}

function numberToCard(cardNumber: number): string {
  const suits: string[] = ['♠️', '♥️', '♣️', '♦️'];
  const ranks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const suit = suits[Math.floor(cardNumber / 13)];
  const rank = ranks[cardNumber % 13];

  return `${rank}${suit}`;
}


const NFTMarketPlaceData: React.FC<NFTTableProps> = ({
  data,
  setListNFTOpen,
  setOpenedNFTMetadata,
  setOwner,
}) => {
  // Transform data into an array
  const dataArray = data
    .map((item: any) => ({
      id: item.tokenId,
      seller: item.seller,
      amount: item.amount,
      ...item.metadata,
    }))
    .sort((a: any, b: any) => Number(b.rarity) - Number(a.rarity)); // for descending order

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
          setOwner(row.seller);
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
        <Typography color='textPrimary'>Price: {row.amount}</Typography>
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


  // Calculate the total width of all cells
  const totalCellWidth = numColumns * itemWidth;

  // Calculate the left and right padding to center the cells
  const paddingLeftRight = (width - totalCellWidth) / 2;

  return (
    <Grid
      columnCount={numColumns}
      columnWidth={150}
      height={windowDimensions.height * 0.6}
      rowCount={numRows}
      rowHeight={250}
      width={width}
      style={{
        paddingLeft: paddingLeftRight,
        paddingRight: paddingLeftRight,
      }}
    >
      {Cell}
    </Grid>
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
    fetch(`${apiUrl}/getListings`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data.data);
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
                    setOwner={setOwner}
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
