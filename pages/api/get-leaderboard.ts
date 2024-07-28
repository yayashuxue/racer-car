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
  console.log(account);
  const token = await sdk.token.createV2({
    collectionId: 3288,
    image: 'https://gateway.pinata.cloud/ipfs/QmeNzaLfsUUi5pGmhrASEpXF52deCDuByeKbU7SuZ9toEi',
    owner: address, // Use the address from the query parameters as the owner
    attributes: [
      {
        trait_type: 'Nickname',
        value: 'nickname',
      },
      {
        trait_type: 'Victories',
        value: 0,
      },
      {
        trait_type: 'Defeats',
        value: 0,
      },
    ],
  });

  if (token.error) {
    res.status(401).json({ message: token.error.message });
  }
  res.status(200).json({ message: 'yo' });
}
