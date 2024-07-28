import { NextApiRequest, NextApiResponse } from 'next';
import { connectSdk } from '../utils/connect-sdk.js';

type ResponseData = {
  message: string;
  result?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    const { score } = req.body;

    if (typeof score === 'number') {
      try {
        const { account, sdk } = await connectSdk();
        // Perform the operation you need with the score
        // For demonstration, let's assume we're storing the score somewhere or processing it

        // Example: Log the score
        console.log(`Player score: ${score}`);

        res.status(200).json({ message: 'Score submitted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(400).json({ message: 'Invalid score' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
