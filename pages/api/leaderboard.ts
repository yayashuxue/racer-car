import { apiUrl } from 'config';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

import { changeAttribute } from '../utils/change-attribute.js';
import { connectSdk } from '../utils/connect-sdk.js';
import { getRandomInt } from '../utils/random.js';
import { Address } from '@unique-nft/sdk/utils';
import { AccountTokensResult } from '@unique-nft/substrate-client/tokens';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { account, sdk } = await connectSdk();

  const tokensResult: AccountTokensResult = await sdk.collection.tokens({
    collectionId: 3288,
  });

  const tokens = await Promise.all(
    tokensResult.ids.map(async (token) => {
      return await sdk.token.get({ tokenId: token, collectionId: 3268 });
    })
  );

  res.status(200).json(tokens);
}
