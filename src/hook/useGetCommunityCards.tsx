import { CONTRACT_ADDRESS, WAGMI_ABI } from 'src/constants';
import { useReadContract } from 'wagmi';

export const useGetCommunityCard = (tableId: string, totalHandsTillNow: number) => {
  return useReadContract({
    abi: WAGMI_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getCommunityCards',
    args: [BigInt(tableId ?? 0), BigInt(totalHandsTillNow)],
    query: {
      refetchInterval: 4200,
      enabled: tableId !== null,
      select(data: unknown) {
        return (data as number[]).map((card) => Number(card));
      },
    },
  });
};
