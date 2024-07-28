import type { PrivyClientConfig } from '@privy-io/react-auth';
import { WsProvider } from '@polkadot/api';
import { nativeEnum } from 'zod';
import { opal } from 'config';

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

  defaultChain: opal,
  supportedChains: [opal],
};
