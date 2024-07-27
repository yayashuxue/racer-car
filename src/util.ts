import { formatEther } from 'viem';

export const toNumber = (value: any) => {
  if (!value) return 0;
  return parseFloat(formatEther(value));
};
