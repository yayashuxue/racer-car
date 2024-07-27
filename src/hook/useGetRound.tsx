import { Round } from 'src/utils/contractUtil';
import { WAGMI_ABI, CONTRACT_ADDRESS } from 'src/constants';
import { toNumber } from 'src/util';
import { useReadContract } from 'wagmi';

export const useGetRound = (tableId: string, totalHandsTillNow: number) => {
  return useReadContract({
    abi: WAGMI_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getRound',
    args: [BigInt(tableId ?? 0), BigInt(totalHandsTillNow)],
    query: {
      select: (data: any) => {
        return {
          roundState: Number(data.roundState),
          isActive: data.isActive,
          turn: Number(data.turn), // 0, 1
          playersInRound: data.playersInRound,
          // highestChip: toNumber(data.highestChip),
          highestChip: data.highestChip,
          chipsPlayersHaveBet: data.chipsPlayersHaveBet,
          // pot: toNumber(data.pot),
          pot: data.pot,
          buttonIndex: Number(data.buttonIndex),
          lastToAct: data.lastToAct,
          playerLastActions: data.playerLastActions,
          winners: data.winners,
          numOfPlayersCanAct: data.numOfPlayersCanAct,
        } as Round;
      },
      refetchInterval: 4200,
      enabled: tableId !== null && totalHandsTillNow !== null,
    },
  });
};
