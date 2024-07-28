import type { NextApiRequest, NextApiResponse } from 'next';
import { changeAttribute } from '../utils/change-attribute.js';
import { connectSdk } from '../utils/connect-sdk.js';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const args = req.body;
  const { account, sdk } = await connectSdk();
  const { address } = req.query;
  if (!address) {
    res.status(400).json({ message: 'Address is required' });
  }
  const tokensResult = await sdk.token.accountTokens({
    collectionId: 3288,
    address: address as string,
  });

  const token = await sdk.token.getV2({
    tokenId: tokensResult.tokens[0]?.tokenId,
    collectionId: 3288,
  });

  const totalScore = token?.attributes?.find((a) => a.trait_type === 'Total Score')?.value;
  const highScore = token?.attributes?.find((a) => a.trait_type === 'High Score')?.value;
  let { nonce } = await sdk.common.getNonce(account);
  const transactions = [];
  let usersHighestScore = Math.max(args.score, Number(highScore));
  transactions.push(
    sdk.token.setProperties(
      {
        collectionId: 3288,
        tokenId: token.tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [
          {
            key: 'tokenData',
            value: changeAttribute(token, 'Total Score', Number(args.score) + Number(totalScore)),
          },
          {
            key: 'tokenData',
            value: changeAttribute(token, 'High Score', usersHighestScore),
          },
        ],
      },
      { nonce: nonce++ }
    )
  );

  const test = await Promise.all(transactions);

  res.status(200).json({ message: 'success' });
}
