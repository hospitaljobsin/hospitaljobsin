import { env } from "@/lib/env/client";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import type { ReactNode } from "react";
import { createContext, useContext, useRef, useState } from "react";

type TurnstileContextType = {
	executeCaptcha: ((event: string) => Promise<string>) | undefined;
	token: string | null;
};

const TurnstileContext = createContext<TurnstileContextType | undefined>(
	undefined,
);

export const TurnstileProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const turnstileRef = useRef<TurnstileInstance>(null);

	const pendingResolver = useRef<((token: string) => void) | undefined>(
		undefined,
	);

	async function executeTurnstile(event: string): Promise<string> {
		return new Promise((resolve) => {
			pendingResolver.current = resolve;
			turnstileRef.current?.execute(); // triggers Turnstile
		});
	}

	const handleSuccess = (newToken: string) => {
		setToken(newToken);
		if (pendingResolver.current) {
			pendingResolver.current(newToken);
			pendingResolver.current = undefined;
		}
		// Reset Turnstile widget without blocking the promise resolution
		setTimeout(() => {
			turnstileRef.current?.reset();
		}, 0);
	};

	return (
		<TurnstileContext.Provider
			value={{
				executeCaptcha: !turnstileRef.current ? undefined : executeTurnstile,
				token,
			}}
		>
			<Turnstile
				as="aside"
				ref={turnstileRef}
				siteKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
				onSuccess={handleSuccess}
				options={{
					execution: "execute",
					size: "invisible",
					appearance: "execute",
				}}
				scriptOptions={{
					nonce: "turnstile-nonce",
					async: true,
					defer: true,
				}}
			/>
			{children}
		</TurnstileContext.Provider>
	);
};

export const useTurnstile = (): TurnstileContextType => {
	const context = useContext(TurnstileContext);
	if (!context) {
		throw new Error("useTurnstile must be used within a TurnstileProvider");
	}
	return context;
};
