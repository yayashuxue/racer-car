import BigNumber from 'bignumber.js';
import { flatten, chunk } from 'lodash';
import { CONTRACT_ADDRESS, selectABI } from 'src/constants';
import { toNumber } from 'src/util';
import { PlayerState } from 'src/utils/contractUtil';
import { useAccount, useReadContracts } from 'wagmi';

export const useGetPlayerState = (
  players: string[],
  tableId: string,
  totalHandsTillNow: number
) => {
  return useReadContracts({
    contracts: flatten(
      players.map((address) => [
        {
          abi: selectABI('getPlayerState'),
          address: CONTRACT_ADDRESS,

          functionName: 'getPlayerState',
          args: [BigInt(tableId ?? '0'), BigInt(totalHandsTillNow ?? '0'), address],
        } as const,
        {
          abi: selectABI('getPlayerChipsRemaining'),
          address: CONTRACT_ADDRESS,

          functionName: 'getPlayerChipsRemaining',
          args: [BigInt(tableId ?? '0'), address],
        } as const,
      ])
    ),
    query: {
      enabled: tableId !== null && totalHandsTillNow !== null && players.length > 0,
      refetchInterval: 4200,
      select(data) {
        const chunked = chunk(data, 2);
        const temp = chunked.reduce((acc, [playerState, chipsRemaining], index) => {
          return {
            ...acc,
            [players[index]]: {
              playerState: playerState.result as PlayerState,
              chipsRemaining: new BigNumber(chipsRemaining.result as string),
            },
          };
        }, {} as Record<`0x${string}`, { playerState: PlayerState; chipsRemaining: BigNumber }>);
        return temp;
      },
    },
  });
};
