"use client";
import { getCurrentEnvironment } from "@/lib/relay/environment";
import { NextUIProvider } from "@nextui-org/react";
import { AppProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [environment] = useState(() => {
    return getCurrentEnvironment();
  });

  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
        <RelayEnvironmentProvider environment={environment}>
          {children}
          <AppProgressBar
            height="4px"
            color="#00a925"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </RelayEnvironmentProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
