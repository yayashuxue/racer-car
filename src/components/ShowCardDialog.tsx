import { zodResolver } from '@hookform/resolvers/zod';
import { Box, CircularProgress, InputAdornment, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { CloseDialogButton } from 'src/components/CloseDialogButton';
import {OPERATOR_ADDRESS, POKER_ABI, POKER_ADDRESS} from 'src/constants';
import { useMintNFT } from 'src/hook/useMintNFT'; 
import { opal } from '../../config';
import {useWatchContractEvent} from 'wagmi';
import * as z from 'zod';
import {apiUrl, config} from '../../config';
import {set} from 'lodash';
import { readContract, writeContract } from '@wagmi/core';
import AnimatedCard from './AnimatedCard';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSnackBar } from 'src/hook/useSnackBar';
import {ethers} from 'ethers';
import Card from 'src/components/TradingCard/Card'

export async function getTokenId() {
  const result = await readContract(config, {
    abi: POKER_ABI,
    address: POKER_ADDRESS,
    functionName: '_tokenIds',
    args: [],
  });

  return result;
}

export const mapRarity = (rarity: string): 'Common' | 'Rare' | 'Epic' | 'Legendary' => {
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

const schema = z.object({
  listingPriceETH: z.string().nonempty({ message: 'Metadata is required' }), // Adjust the schema to require metadata
});

type Props = {
  open: boolean;
  handleClose: () => void;
  data: any;
};

type MetadataType = {
  imageUrl: string | undefined;
  specialEffects: number;
  rarity: number;
};


export const ShowCardDialog = ({ open, handleClose, data }: Props) => {
  const theme = useTheme();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { user } = usePrivy();
  const address = user?.wallet?.address;

  useEffect(() => {
    if (wallet && Number(wallet.chainId) !== opal.id) {
      wallet.switchChain(opal.id);
    }
  }, [wallet]);
  const [isListingSuccessful, setIsListingSuccessful] = useState(false);
  const [isPurchaseSuccessful, setIsPurchaseSuccessful] = useState(false);
  // const [isApproved, setIsApproved] = useState(false);
  const isLightTheme = theme.palette.mode === 'light';
  const [metadata, setMetadata] = useState<any>(null);
  const { showSuccess, showError } = useSnackBar();

  useEffect(() => {
    console.log('Metadata:', metadata);
  }, [metadata]);

  const close = () => {
    handleClose();
  };

  return (
    <Dialog disableEnforceFocus open={open} PaperProps={{}}>
      <CloseDialogButton handleClose={close} />
      <DialogContent>
        <Box p={{ xs: 2, md: 4, textAlign: 'center' }} pb={{ xs: 2, md: 1 }}>
          <Typography fontSize={20}>Card Airdropped 🎉</Typography>
          <Typography>
            Progress Your Card By Playing more game 🎮. Make it better at Pit Lane 🅿️.
          </Typography>

          <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
            <Card data={data}  />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};