import { Sdk, CHAIN_CONFIG } from '@unique-nft/sdk/full';
import { Sr25519Account } from '@unique-nft/sr25519';
import config from './config.js';

export const connectSdk = async () => {
  const account = Sr25519Account.fromUri(config.mnemonic);

  const sdk = new Sdk({
    baseUrl: CHAIN_CONFIG.opal.restUrl,
    account,
  });

  return {
    account,
    sdk,
  };
};
