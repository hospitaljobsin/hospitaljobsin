"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Authenticator>{children}</Authenticator>;
}
