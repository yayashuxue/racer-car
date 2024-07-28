import type { NextApiRequest, NextApiResponse } from 'next';
import { changeAttribute } from '../utils/change-attribute.js';
import { connectSdk } from '../utils/connect-sdk.js';
import { getRandomInt } from '../utils/random.js';
import { Address } from '@unique-nft/sdk/utils';
import { AccountTokensResult } from '@unique-nft/substrate-client/tokens';
type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const args = req.body;
  const { carLevel } = args;
  const { account, sdk } = await connectSdk();
  const { address } = req.query;
  const tokensResult: AccountTokensResult = await sdk.token.accountTokens({
    collectionId: 3288,
    address: address,
  });
  if (!address) {
    res.status(400).json({ message: 'Address is required' });
  }
  const token = await sdk.token.getV2({
    tokenId: tokensResult.tokens[0].tokenId,
    collectionId: 3288,
  });

  const totalScore = token?.attributes.find((a) => a.trait_type === 'Total Score').value;

  let { nonce } = await sdk.common.getNonce(account);
  const transactions = [];

  const cost = {
    0: 1000,
    1: 1500,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 5000,
    6: 6000,
    7: 7000,
    8: 8000,
  };

  if (totalScore < cost[carLevel]) {
    res.status(400).json({ message: 'Not enough score' });
  }
  transactions.push(
    sdk.token.setProperties(
      {
        collectionId: 3288,
        tokenId: token.tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [
          {
            key: 'tokenData',
            value: changeAttribute(token, 'Total Score', totalScore - cost[carLevel]),
          },
          {
            key: 'tokenData',
            value: changeAttribute(token, 'Car Level', carLevel),
          },
        ],
      },
      { nonce: nonce++ }
    )
  );

  transactions.push(
    sdk.token.setProperties(
      {
        collectionId: 3288,
        tokenId: token.tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [
          {
            key: 'tokenData',
            value: changeAttribute(token, 'Car Level', carLevel),
          },
        ],
      },
      { nonce: nonce++ }
    )
  );

  const test = await Promise.all(transactions);
  console.log(test);
  res.status(200).json({ message: test });
}
