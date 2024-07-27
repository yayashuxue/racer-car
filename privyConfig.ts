import type {PrivyClientConfig} from '@privy-io/react-auth';
import {baseSepolia} from 'viem/chains';

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  // embeddedWallets: {
  //   createOnLogin: 'users-without-wallets',
  //   requireUserPasswordOnCreate: true,
  //   noPromptOnSignature: false,
  // },
  // loginMethods: ['wallet', 'email', 'sms'],
  // appearance: {
  //   showWalletLoginFirst: true,
  // },
  defaultChain: baseSepolia, 
  supportedChains: [baseSepolia],
};