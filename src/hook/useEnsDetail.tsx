//  Not in use Could be useful
import { http, createConfig } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { maskAddress } from 'src/utils/maskAddress';
import { useEnsName } from 'wagmi';
import { useEnsAvatar } from 'wagmi';
import { normalize } from 'viem/ens';
import { usePrivy } from '@privy-io/react-auth';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const useGetEnsDetail = () => {
  const { user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}`;

  const { data = '' } = useEnsName({
    address,
    chainId: 1,
    config,
  });

  const { data: avatar } = useEnsAvatar({
    name: normalize(data as string),
    chainId: 1,
    config,
  });

  return { displayName: data || maskAddress(address ?? ''), avatar };
};

export const useGetEnsDetailByAddress = ({ address }: { address: `0x${string}` }) => {
  const { data = '', status: status1 } = useEnsName({
    address,
    chainId: 1,
    config,
  });

  const { data: avatar, status: status2 } = useEnsAvatar({
    name: normalize(data as string),
    chainId: 1,
    config,
  });

  console.log(status1, status2);

  return { displayName: data || maskAddress(address ?? ''), avatar };
};
