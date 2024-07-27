// pages/api/leaderboard.ts

import {apiUrl} from 'config';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`${apiUrl}/getLeaderboard`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  res.status(200).json(data);
}