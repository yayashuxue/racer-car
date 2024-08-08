import BigNumber from 'bignumber.js';
import { CONTRACT_ADDRESS, WAGMI_ABI } from 'src/constants';
import { useAccount, useReadContract } from 'wagmi';

export const useGetGlobalChip = () => {
  const { address } = useAccount();

  return useReadContract({
    abi: WAGMI_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'globalChips',
    args: [address],
    query: {
      refetchInterval: 4200,
      // enabled: address !== null,
      select(data) {
        return new BigNumber(data);
      },
    },
  });
};
