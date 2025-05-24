import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { env } from "@/lib/env/client";

type TurnstileContextType = {
	executeCaptcha: ((event: string) => Promise<string>) | undefined;
	token: string | null;
};

const TurnstileContext = createContext<TurnstileContextType | undefined>(
	undefined,
);

export const TurnstileProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [isReady, setIsReady] = useState(false);
	const turnstileRef = useRef<TurnstileInstance>(null);

	const pendingResolver = useRef<((token: string) => void) | undefined>(
		undefined,
	);

	async function executeTurnstile(event: string): Promise<string> {
		if (!turnstileRef.current) {
			throw new Error("Turnstile is not initialized");
		}
		return new Promise((resolve) => {
			pendingResolver.current = resolve;
			turnstileRef.current.execute();
		});
	}

	const handleSuccess = (newToken: string) => {
		setToken(newToken);
		if (pendingResolver.current) {
			pendingResolver.current(newToken);
			pendingResolver.current = undefined;
		}
		setTimeout(() => {
			turnstileRef.current?.reset();
		}, 0);
	};

	// Set `isReady` to true when the ref becomes non-null
	useEffect(() => {
		if (turnstileRef.current && !isReady) {
			setIsReady(true);
		}
	}, [turnstileRef.current]);

	return (
		<TurnstileContext.Provider
			value={{
				executeCaptcha: isReady ? executeTurnstile : undefined,
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
