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
  const args = req.body;
  const [carsCollectionId, achievementsCollectionId, tokenId1, tokenId2] = args;
  const { account, sdk } = await connectSdk();
  console.log(account);
  const test = await sdk.token.transfer({
    collectionId: 3225,
    tokenId: 3,
    to: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  });
  console.log(test);
  res.status(200).json({ test });
}
