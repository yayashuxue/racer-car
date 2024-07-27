import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { PrivyProvider } from '@privy-io/react-auth';
// Make sure to import these from `@privy-io/wagmi`, not `wagmi`
import { WagmiProvider } from '@privy-io/wagmi';

import { ThemeProvider, createTheme } from '@mui/material';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '../src/Layout';

import { SnackbarProvider } from 'notistack';
import { createContext, useEffect, useMemo, useState } from 'react';
import { config } from '../config';
import { privyConfig } from '../privyConfig';

import { getDesignTokens } from 'src/theme';
import '@fontsource/aldrich/400.css';
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const client = new QueryClient();


const disableConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
};

disableConsole();
function MyApp({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const theme =
      typeof window !== 'undefined'
        ? (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark'
        : 'dark';

    setMode(theme);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newMode);
          }
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <PrivyProvider appId='clz4mu19p00ijeuki11ljui09' config={privyConfig}>
      <QueryClientProvider client={client}>
        <WagmiProvider config={config}>
          {/* <RainbowKitProvider> */}
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </ColorModeContext.Provider>
          {/* </RainbowKitProvider> */}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default MyApp;
