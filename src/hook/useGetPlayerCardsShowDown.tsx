import { flatten } from 'lodash';
import { PlayerCardsPlainText } from 'src/utils/contractUtil';
import { WAGMI_ABI, CONTRACT_ADDRESS, selectABI } from 'src/constants';
import { useReadContracts } from 'wagmi';

export const useGetPlayerCardsShowDown = (players: string[], _tableId: string, _handNum: number) => {
  return useReadContracts({
    contracts: flatten(
      players.map((address) => [
        {
          abi: selectABI('getPlayerCardsShowDown'),
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'getPlayerCardsShowDown',
          args: [address, BigInt(_tableId), BigInt(_handNum)],
        },
      ])
    ),
    query: {
        select: (data) => {
        const temp = data.reduce((acc, playerCards, index) => {
            if (playerCards.status === 'success') {
            return {
                ...acc,
                [players[index]]: playerCards.result as PlayerCardsPlainText,
            };
            } else {
            console.error(playerCards.error);
            return acc;
            }
        }, {} as Record<string, PlayerCardsPlainText>);
        return temp;
        },
        enabled: _tableId !== null && _handNum !== null,
    },
  });
};