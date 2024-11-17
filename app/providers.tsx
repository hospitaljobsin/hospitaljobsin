"use client";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

export default function Providers({ children }: {children: React.ReactNode}) {
  return         <Authenticator>
  {children}
</Authenticator>;
}