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
  const { account, sdk } = await connectSdk();
  const { address, type } = req.query;
  if (!address) {
    res.status(400).json({ message: 'Address is required' });
  }
  const tokensResult: AccountTokensResult = await sdk.token.accountTokens({
    collectionId: 3429,
    address: address as string,
  });
  const token = await sdk.token.getV2({
    tokenId: tokensResult.tokens[0].tokenId,
    collectionId: 3429,
  });
  const totalScore = Number(token?.attributes?.find((a) => a.trait_type === 'Total Score')?.value);

  let { nonce } = await sdk.common.getNonce(account);
  if (type === 'car') {
    const transactions = [];
    const cost: { [key: number]: number } = {
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

    const { carLevel } = args;
    if (totalScore < cost[carLevel]) {
      res.status(400).json({ message: 'Not enough score' });
    }
    transactions.push(
      sdk.token.setProperties(
        {
          collectionId: 3429,
          tokenId: token.tokenId,
          // NOTICE: Attributes stored in "tokenData" property
          properties: [
            {
              key: 'tokenData',
              value: changeAttribute(token, 'Total Score', totalScore - cost[carLevel]),
            },
          ],
        },
        { nonce: nonce++ }
      )
    );
    transactions.push(
      sdk.token.setProperties(
        {
          collectionId: 3429,
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
    res.status(200).json({ message: 'success' });
  } else if (type === 'gas') {
    const { gasLevel } = args;
    const transactions = [];

    const cost: { [key: number]: number } = {
      0: 1000,
      1: 1500,
      2: 2000,
    };

    const { carLevel } = args;
    if (totalScore < cost[carLevel]) {
      res.status(400).json({ message: 'Not enough score' });
    }
    transactions.push(
      sdk.token.setProperties(
        {
          collectionId: 3429,
          tokenId: token.tokenId,
          // NOTICE: Attributes stored in "tokenData" property
          properties: [
            {
              key: 'tokenData',
              value: changeAttribute(token, 'Total Score', totalScore - cost[gasLevel]),
            },
          ],
        },
        { nonce: nonce++ }
      )
    );
    transactions.push(
      sdk.token.setProperties(
        {
          collectionId: 3429,
          tokenId: token.tokenId,
          properties: [
            {
              key: 'tokenData',
              value: changeAttribute(token, 'Gas Level', gasLevel),
            },
          ],
        },
        { nonce: nonce++ }
      )
    );
    const test = await Promise.all(transactions);
    res.status(200).json({ message: 'success' });
  } else if (type === 'wheels') {
    const transactions = [];

    const cost: { [key: number]: number } = {
      0: 1000,
      1: 1500,
      2: 2000,
    };

    const { wheelsLevel } = args;
    if (totalScore < cost[wheelsLevel]) {
      res.status(400).json({ message: 'Not enough score' });
    }
    transactions.push(
      sdk.token.setProperties(
        {
          collectionId: 3429,
          tokenId: token.tokenId,
          // NOTICE: Attributes stored in "tokenData" property
          properties: [
            {
              key: 'tokenData',
              value: changeAttribute(token, 'Total Score', totalScore - cost[wheelsLevel]),
            },
          ],
        },
        { nonce: nonce++ }
      )
    );
    transactions.push(
      sdk.token.setProperties(
        {
          collectionId: 3429,
          tokenId: token.tokenId,
          // NOTICE: Attributes stored in "tokenData" property
          properties: [
            {
              key: 'tokenData',
              value: changeAttribute(token, 'Wheels Level', wheelsLevel),
            },
          ],
        },
        { nonce: nonce++ }
      )
    );
    const test = await Promise.all(transactions);
    res.status(400).json({ message: 'Invalid type' });
  }
}
