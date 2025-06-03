"use client";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type HeadersContextType = {
	headersPromise: Promise<ReadonlyHeaders>;
};

const HeadersContext = createContext<HeadersContextType | undefined>(undefined);

export const HeadersProvider = ({
	children,
	headersPromise,
}: { children: ReactNode; headersPromise: Promise<ReadonlyHeaders> }) => {
	return (
		<HeadersContext.Provider
			value={{
				headersPromise: headersPromise,
			}}
		>
			{children}
		</HeadersContext.Provider>
	);
};

export const useHeaders = (): HeadersContextType => {
	const context = useContext(HeadersContext);
	if (!context) {
		throw new Error("useHeaders must be used within a HeadersProvider");
	}
	return context;
};
