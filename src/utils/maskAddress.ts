export const maskAddress = (address: string) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};
