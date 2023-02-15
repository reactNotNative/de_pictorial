import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Provider } from 'jotai';
import Header from '../components/Header';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygonMumbai } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import '@biconomy/web3-auth/dist/src/style.css';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { MantineProvider, createEmotionCache } from '@mantine/core';
const { chains, provider } = configureChains(
  [mainnet],
  // [polygonMumbai],
  [
    jsonRpcProvider({ rpc: () => ({ http: 'https://rpc.ankr.com/eth' }) }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const myCache = createEmotionCache({
  key: 'mantine',
  prepend: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <MantineProvider
        withGlobalStyles
        withCSSVariables
        withNormalizeCSS
        emotionCache={myCache}
        theme={{
          colorScheme: 'dark',
        }}
      >
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Header />
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </MantineProvider>
    </Provider>
  );
}

export default MyApp;
