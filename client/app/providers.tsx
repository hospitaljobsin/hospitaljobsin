"use client";

import { getCurrentEnvironment } from "@/lib/relay/environment";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { RelayEnvironmentProvider } from "react-relay";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";

export default function Providers({ children }: { children: React.ReactNode }) {
  const environment = getCurrentEnvironment();

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <ConfigureAmplifyClientSide />
        <RelayEnvironmentProvider environment={environment}>
          {children}
        </RelayEnvironmentProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
