"use client";

import { authConfig } from "@/lib/auth-config";
import { Amplify } from "aws-amplify";

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true }
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
