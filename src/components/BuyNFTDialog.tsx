import { zodResolver } from '@hookform/resolvers/zod';
import { Box, CircularProgress, InputAdornment, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CloseDialogButton } from 'src/components/CloseDialogButton';
import { OPERATOR_ADDRESS, POKER_ABI, POKER_ADDRESS } from 'src/constants';
import { useMintNFT } from 'src/hook/useMintNFT';
import { opal } from '../../config';
import { useWatchContractEvent } from 'wagmi';
import * as z from 'zod';
import { apiUrl, config } from '../../config';
import { set } from 'lodash';
import { readContract, writeContract } from '@wagmi/core';
import AnimatedCard from './AnimatedCard';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useSnackBar } from 'src/hook/useSnackBar';
import { ethers } from 'ethers';

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
  setOwner: React.Dispatch<React.SetStateAction<any>>;
  row: any;
  open: boolean;
  handleClose: () => void;
};

type MetadataType = {
  imageUrl: string | undefined;
  specialEffects: number;
  rarity: number;
};

export const BuyNFTDialog = ({ setOwner, row, open, handleClose }: Props) => {
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
  const [tokenId, setTokenId] = useState(-1);
  const [price, setPrice] = useState(-1);
  const [approvalSubmitted, setApprovalSubmitted] = useState(false);
  const { showSuccess, showError } = useSnackBar();

  useEffect(() => {
    if (row) {
      setMetadata({
        cost: row?.cost,
        name: row?.name,
        specialEffects: row?.specialEffects,
        imageUrl: row?.imageUrl,
        type: row?.type,
      });
      setTokenId(Number(row?.id));
      setIsListingSuccessful(row?.forSale);
      setPrice(row?.amount);
    }

    console.log('row data', row);
  }, [row]);

  useEffect(() => {
    console.log('Metadata:', metadata);
  }, [metadata]);

  const handlePurchase = async () => {
    if (tokenId === -1) {
      showError('Invalid token');
      return;
    }

    const response = await fetch(`/api/redeem-score?type=${metadata.type}&address=${address}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gasLevel: 1,
      }),
    });

    if (response.ok) {
      setOwner(address);
      setIsPurchaseSuccessful(true);
      // Show success message
      showSuccess('NFT listed purhcased successfully at $' + price);
    } else {
      // Show error message
      showError('Error: ' + response.status + ' ' + response.statusText);
    }
  };

  const close = () => {
    setTokenId(-1);
    setMetadata(null);
    setIsPurchaseSuccessful(false);
    handleClose();
  };

  return (
    <Dialog disableEnforceFocus open={open} PaperProps={{}}>
      <CloseDialogButton handleClose={close} />
      <DialogContent>
        <Box p={{ xs: 2, md: 4, textAlign: 'center' }} pb={{ xs: 2, md: 1 }}>
          {/* <Typography fontSize={20}>Purchase Equipment</Typography> */}
          {metadata && (
            <div>
              <Typography fontSize={20}> {metadata.name}</Typography>
              <Typography> {metadata.specialEffects}</Typography>
              <Typography>Cost: ${metadata.cost}</Typography>
              <img
                src={metadata?.imageUrl}
                alt='card'
                style={{
                  width: '300px',
                  height: '300px',
                  animation: 'pulse 2s infinite', // Pulse animation
                }}
              />

              <style>
                {`
                  @keyframes pulse {
                    0% {
                      transform: scale(1);
                    }
                    50% {
                      transform: scale(1.05);
                    }
                    100% {
                      transform: scale(1);
                    }
                  }
                `}
              </style>
            </div>
          )}

          <Button
            variant='contained'
            fullWidth
            sx={{ mt: 2, mb: 2 }}
            disabled={isPurchaseSuccessful}
            onClick={() => {
              handlePurchase();
            }}
          >
            {isPurchaseSuccessful ? 'Purchase Successful!' : 'Purchase'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
