import BigNumber from 'bignumber.js';
import { CONTRACT_ADDRESS, WAGMI_ABI } from 'src/constants';
import { useAccount, useReadContract } from 'wagmi';

export const useChipUnit = () => {
  return useReadContract({
    abi: WAGMI_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'globalChipsUnit',
    args: [],
    query: {
      select(data) {
        return new BigNumber(data); 
      },
    },
  });
};
