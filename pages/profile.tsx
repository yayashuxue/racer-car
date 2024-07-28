import { Box, Button, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import AnimatedCard from 'src/components/AnimatedCard';
import StaticCard from 'src/components/StaticCard';
import { OpponentDetail } from 'src/components/OpponentDetail';
import { useTokenBalance } from 'src/apihook/useTokenBalance';
import styles from 'styles/Home.module.css';
import { FixedSizeGrid as Grid } from 'react-window';
import { apiUrl } from 'config';
import { useSnackBar } from 'src/hook/useSnackBar';
import Card from 'src/components/TradingCard/Card';
import { POKEMON_ATTRIBUTES } from 'src/components/TradingCard/data';
import { opal } from 'config';
import { toPng } from 'html-to-image';

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

const Home: NextPage = () => {
  const router = useRouter();
  const { login, ready, authenticated, logout, user, unlinkTwitter, linkTwitter } = usePrivy();
  const [data, setData] = useState<any>(null);
  const { wallets } = useWallets();
  const wallet = user?.wallet;
  // Inside your component
  const addressFromUrl = router.query.address;

  const [address, setAddress] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/distribute-nft?address=${address}`, {
          method: 'GET', // or 'POST' if your endpoint expects a POST request
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('succeed');

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    if (address && address != '') {
      getData();
    }
  }, [address]);


    const cardRef = useRef(null);

    const handleExport = () => {
      if (cardRef.current === null) {
        return;
      }

      toPng(cardRef.current)
        .then((dataUrl: string) => {
          const link = document.createElement('a');
          link.download = 'card.png';
          link.href = dataUrl;
          link.click();
          // Twitter redirect with pre-filled tweet
          const tweetText = encodeURIComponent(
            "I'm top player on Rac3r at rac3r.vercel.app powered by @Unique_NFTchain & @Polkadot"
          );
          const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
          window.open(twitterUrl, '_blank', 'noopener,noreferrer');
        })
        .catch((err: any) => {
          console.error('Failed to export card as PNG', err);
        });
    };

    const { showError } = useSnackBar();
    useEffect(() => {
      if (addressFromUrl) {
        setAddress(Array.isArray(addressFromUrl) ? addressFromUrl[0] : addressFromUrl);
        console.log('addressFromUrl:', addressFromUrl);
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
    if (wallets && wallets[0] && Number(wallets[0].chainId) !== opal.id) {
      wallets[0].switchChain(opal.id);
    }
  }, [wallets, authenticated, ready, user]);

  const tokenBalance = useTokenBalance(address);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [listNFTOpen, setListNFTOpen] = useState(false);
  const [openedNFTMetadata, setOpenedNFTMetadata] = useState<any>({});
  const [twitter, setTwitter] = useState(null);

console.log('Address:', address);
console.log('Data:', data);
console.log('Condition:', !!(address && address !== '' && address !== '0x0' && data));
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div ref={cardRef}>
                {!!(address && address !== '' && address !== '0x0' && data) && data ? (
                  <Card data={data} />
                ) : null}
              </div>
            </div>{' '}
            {/* <Box mt={2}>
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
            </Box> */}
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              gap={2}
              my={3}
            >
              <Button variant='outlined' onClick={handleExport}>
                Shill it on Twitter
              </Button>
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
