import {apiUrl} from 'config';
import { useState, useEffect } from 'react';

export const useTokenBalance = (address: unknown) => {
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      const response = await fetch(`${apiUrl}/getTokenBalance?address=${address}`);
      const data = await response.json();
      setTokenBalance(data.data);
    };
    fetchTokenBalance();
    const intervalId = setInterval(fetchTokenBalance, 10 * 1000); // refetch every minute

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [address]);

  return tokenBalance;
};
