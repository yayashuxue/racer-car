import { apiUrl } from 'config';
import { useEffect, useState } from 'react';

export const useTokenBalance = (address: string) => {
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/distribute-nft?address=${address}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTokenBalance(data.totalScore);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    if (address && address !== '') {
      fetchTokenBalance();
    }
  }, [address]);

  return tokenBalance;
};


