import React from "react";
import { AppProps } from "next/app";
import { Refine } from "@pankod/refine-core";
import {
  AuthPage,
  NotificationsProvider,
  notificationProvider,
  MantineProvider,
  Global,
  ReadyPage,
  ErrorComponent,
  useLocalStorage,
  ColorSchemeProvider,
  ColorScheme,
  DarkTheme,
  LightTheme,
} from "@pankod/refine-mantine";
import routerProvider from "@pankod/refine-nextjs-router";
import { dataProvider, liveProvider } from "@pankod/refine-appwrite";
import { authProvider } from "src/authProvider";
import { appwriteClient } from "src/utility";
import { Title, Sider, Layout, Header } from "@components/layout";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={colorScheme === "dark" ? DarkTheme : LightTheme}
        withNormalizeCSS
        withGlobalStyles
      >
        <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
        <NotificationsProvider position="top-right">
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(appwriteClient, {
              databaseId: "default",
            })}
            liveProvider={liveProvider(appwriteClient, {
              databaseId: "default",
            })}
            liveMode="auto"
            authProvider={authProvider}
            LoginPage={AuthPage}
            notificationProvider={notificationProvider}
            ReadyPage={ReadyPage}
            catchAll={<ErrorComponent />}
            Title={Title}
            Sider={Sider}
            Layout={Layout}
            Header={Header}
          >
            <Component {...pageProps} />
          </Refine>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
