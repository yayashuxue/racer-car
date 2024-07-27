import { Box, Link, Typography, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { maskAddress } from 'src/utils/maskAddress';
import { useChainId, useConfig, useConnect } from 'wagmi';

export const useSnackBar = () => {
  const chainId = useChainId();
  const { chains } = useConfig({});
  const chain = chains.find((c) => c.id === chainId);
  const blockExplorer = chain?.blockExplorers?.default.url;
  const theme = useTheme();
  return {
    showSuccess: (detail: string, txHash: string = '') =>
      enqueueSnackbar(
        <Box>
          <Typography>Success: {detail}</Typography>
          {txHash != '' ? (
            <Typography display='flex' alignItems='center' gap={0.5}>
              Tx:
              <Link
                href={
                  blockExplorer
                    ? `${blockExplorer}/tx/${txHash}`
                    : `https://etherscan.io/tx/${txHash}`
                }
                color='#ffffff'
              >
                {maskAddress(txHash)}
              </Link>
            </Typography>
          ) : (
            <></>
          )}
        </Box>,
        { variant: 'success', autoHideDuration: 2000 }
      ),
    showError: (detail: string) =>
      enqueueSnackbar(
        <Box>
          <Typography>Error: {detail}</Typography>
        </Box>,
        { variant: 'error', autoHideDuration: 2000 }
      ),
    showStatus: (detail: string) =>
      enqueueSnackbar(
        <Box>
          <Typography>{detail}</Typography>
        </Box>,
        {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'info',
          autoHideDuration: 2500
        }
      ),
  };
};
