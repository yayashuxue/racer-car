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
  console.log(address);
  const tokensResult = await sdk.token.accountTokens({
    collectionId: 3474,
    address: address,
  });

  const token = await sdk.token.getV2({
    tokenId: tokensResult.tokens[0]?.tokenId,
    collectionId: 3474,
  });

  const totalScore = token?.attributes?.find((a) => a.trait_type === 'Total Score')?.value;
  console.log(token?.attributes);
  const highScore = token?.attributes?.find((a) => a.trait_type === 'High Score')?.value;
  console.log({ totalScore });
  let { nonce } = await sdk.common.getNonce(account);
  const transactions = [];
  let usersHighestScore = Math.max(Number(args.score), Number(highScore));
  let newTotalScore = Number(totalScore) + args.score;
  console.log({ newTotalScore });
  transactions.push(
    await sdk.token.setProperties(
      {
        collectionId: 3474,
        tokenId: token.tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [
          {
            key: 'tokenData',
            value: changeAttribute(token, 'High Score', usersHighestScore),
          },
        ],
      },
      { nonce: nonce++ }
    )
  );

  transactions.push(
    await sdk.token.setProperties(
      {
        collectionId: 3474,
        tokenId: token.tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [
          {
            key: 'tokenData',
            value: changeAttribute(token, 'Total Score', newTotalScore),
          },
        ],
      },
      { nonce: nonce++ }
    )
  );
  const test = await Promise.all(transactions);
  console.log(test);
  res.status(200).json({ message: 'success' });
}
