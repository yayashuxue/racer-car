import { apiUrl } from 'config';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

import { changeAttribute } from '../utils/change-attribute.js';
import { connectSdk } from '../utils/connect-sdk.js';
import { getRandomInt } from '../utils/random.js';
import { Address } from '@unique-nft/sdk/utils';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { address } = req.query;
  if (!address || typeof address !== 'string') {
    res.status(400).json({ message: 'Address is required' });
  }
  const { account, sdk } = await connectSdk();
  const tokensResult = await sdk.token.accountTokens({
    collectionId: 3288,
    address: address,
  });
  const token = tokensResult.tokens[0];
  if (!token) {
    res.status(400).json({ message: 'No tokens found' });
  }
  const usersToken = await sdk.token.properties(token);
  // if (token.error) {
  //   res.status(401).json({ message: token.error.message });
  // }
  res.status(200).json(usersToken);
}
