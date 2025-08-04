import { useHeaders } from "@/components/HeadersProvider";
import { use } from "react";

export default function useIsAuthenticated() {
	const { headersPromise } = useHeaders();
	const headersList = use(headersPromise);
	const headersMap = new Map(headersList);
	const isAuthenticated = headersMap.get("x-is-authenticated");

	if (!isAuthenticated) {
		throw new Error("Is authenticated header is required in headers");
	}

	return { isAuthenticated: isAuthenticated === "true" };
}
