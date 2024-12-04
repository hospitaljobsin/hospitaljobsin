"use client";

import { getCurrentEnvironment } from "@/lib/relay/environment";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { RelayEnvironmentProvider } from "react-relay";
import ConfigureAmplifyClientSide from "./config-amplify-client-side";

export default function Providers({ children }: { children: React.ReactNode }) {
  const environment = getCurrentEnvironment();

  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        <ConfigureAmplifyClientSide />
        <RelayEnvironmentProvider environment={environment}>
          {children}
        </RelayEnvironmentProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
