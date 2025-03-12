"use client";

import TwoFactorAuthenticationForm from "@/components/auth/two-factor/TwoFactorAuthenticationForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Two Factor Authentication",
};

export default function TwoFactorAuthentication() {
	return <TwoFactorAuthenticationForm />;
}
