import { apiUrl } from 'config';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectSdk } from '../utils/connect-sdk.js';

import { AccountTokensResult } from '@unique-nft/substrate-client/tokens';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { account, sdk } = await connectSdk();

  const tokensResult: AccountTokensResult = await sdk.collection.tokens({
    collectionId: 3288,
  });
  console.log(tokensResult);
  const tokens = await Promise.all(
    tokensResult.ids.map(async (token) => {
      const v2Result = await sdk.token.getV2({
        tokenId: token,
        collectionId: 3288,
      });

      return {
        address: v2Result.owner,
        totalScore: v2Result.attributes.find((a) => a.trait_type === 'Total Score').value,
        points: String(v2Result.attributes.find((a) => a.trait_type === 'High Score').value),
        carLevel: v2Result.attributes.find((a) => a.trait_type === 'Car Level').value,
      };
    })
  );

  tokens.sort((a, b) => b.totalScore - a.totalScore);

  res.status(200).json(tokens);
}
