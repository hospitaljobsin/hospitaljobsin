import { use } from 'react';
import { useHeaders } from '@/components/HeadersProvider';

export default function useIsAuthenticated() {
	const { headersPromise } = useHeaders();
	const headersList = use(headersPromise);
	const headersMap = new Map(headersList);
	const isAuthenticated = headersMap.get('x-is-authenticated');

	if (!isAuthenticated) {
		// don't error if header is missing, this happens when we pre-fetch
		return { isAuthenticated: false };
	}

	return { isAuthenticated: isAuthenticated === 'true' };
}
