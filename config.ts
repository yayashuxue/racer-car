// config.ts
// import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';

import { Chain } from 'viem';
import { http } from 'wagmi';
import { createConfig } from '@privy-io/wagmi';
import { addRpcUrlOverrideToChain } from '@privy-io/react-auth';

export const opal: Chain = {
  id: 8882,
  name: 'Opal testnet',
  nativeCurrency: { name: 'UNQ', symbol: 'UNQ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-opal.unique.network/'] },
  },
  blockExplorers: {
    default: { name: 'unq', url: 'https://uniquescan.io/' }
  }
};
export const config = createConfig({
  chains: [opal],
  transports: {
    [opal.id]: http(),
  },
});

// export const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.walletpoker.xyz';
const useLocalApi = process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true';
export const apiUrl = useLocalApi ? 'http://localhost:8000' : 'https://api.walletpoker.xyz';
// let apiUrl = 'https://api.walletpoker.xyz';
// if (process.env.REACT_APP_USE_LOCALHOST === 'true') {
//   apiUrl = 'http://localhost:8000';
// }
// export{apiUrl};
