import { get } from 'lodash';
import { POKER_ABI, POKER_ADDRESS } from 'src/constants';
import { useSnackBar } from 'src/hook/useSnackBar';
import { useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent } from 'wagmi';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

type Props = {
  onSuccess?: () => void;
};


export const useMintNFT = ({ onSuccess }: Props = {}) => {
  const { showSuccess, showError } = useSnackBar();
  const [txHash, setTxHash] = useState('0x');
  const [mintStatus, setMintStatus] = useState('idle'); // Add this line
  const resetStatus = () => {
    setMintStatus('idle'); // replace 'idle' with the initial status value
  };
  const {
    writeContract,
    data: hash,
    status,
  } = useWriteContract({
    mutation: {
      onSuccess: (txHash) => {
        showSuccess('Mint Success', txHash);
        setTxHash(txHash);
        setMintStatus('success');
        if (onSuccess) onSuccess();
      },
      onError: (e) => {
        const error = get(e, 'cause.shortMessage', 'Transaction failed');
        showError(error);
        setMintStatus('error'); 
      },
    },
  });
  const receipt = useWaitForTransactionReceipt({ hash: txHash as `0x${string}` });
  useEffect(() => {
    if (status === 'pending') {
      setMintStatus('pending'); // Update mintStatus when status is 'pending'
    }
  }, [status]);

  return {
    mint: async (tokenId: number) => {
      const result = await writeContract({
        abi: POKER_ABI,
        address: POKER_ADDRESS,
        functionName: 'mintNFT',
        args: [tokenId],
      });
    },
    status: mintStatus,
    receipt,
    resetStatus,
  };
};