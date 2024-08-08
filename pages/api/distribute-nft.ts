import { apiUrl } from 'config';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

import { connectSdk } from '../utils/connect-sdk.js';

type ResponseData = {
  message: string;
  address?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { address } = req.query;
  if (!address || typeof address !== 'string') {
    res.status(400).json({ message: 'Address is required' });
  }
  const { account, sdk } = await connectSdk();
  const tokensResult = await sdk.token.accountTokens({
    collectionId: 3474,
    address: address,
  });
  if (tokensResult.tokens.length > 0) {
    const token = tokensResult.tokens[0];
    const v2Result = await sdk.token.getV2({
      tokenId: tokensResult.tokens[0].tokenId,
      collectionId: 3474,
    });
    res.status(200).json({
      address: v2Result.owner,
      totalScore: v2Result.attributes.find((a) => a.trait_type === 'Total Score').value,
      points: String(v2Result.attributes.find((a) => a.trait_type === 'High Score').value),
      carLevel: v2Result.attributes.find((a) => a.trait_type === 'Car Level').value,
      wheelsLevel: v2Result.attributes.find((a) => a.trait_type === 'Wheels Level').value,
      gasLevel: v2Result.attributes.find((a) => a.trait_type === 'Gas Level').value,
    });
  }
  const token = await sdk.token.createV2({
    collectionId: 3474,
    image: 'https://gateway.pinata.cloud/ipfs/QmeNzaLfsUUi5pGmhrASEpXF52deCDuByeKbU7SuZ9toEi',
    owner: address?.toString(), // Use the address from the query parameters as the owner
    attributes: [
      {
        trait_type: 'Total Score',
        value: 0,
      },
      {
        trait_type: 'High Score',
        value: 0,
      },
      {
        trait_type: 'Car Level',
        value: 0,
      },
      {
        trait_type: 'Gas Level',
        value: -1,
      },
      {
        trait_type: 'Wheels Level',
        value: 0,
      },
    ],
  });
  if (token?.error) {
    res.status(401).json({ message: token.error.message });
  }
  console.log('hit');
  res.status(200).json({
    address: address,
    totalScore: 0,
    points: 0,
    carLevel: 0,
    gasLevel: -1,
    wheelsLevel: 0,
  });
}
