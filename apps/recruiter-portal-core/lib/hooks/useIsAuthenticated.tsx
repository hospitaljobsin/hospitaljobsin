import { useHeaders } from '@/components/HeadersProvider';
import { use } from 'react';

export default function useIsAuthenticated() {
	const { headersPromise } = useHeaders();
	const headersList = use(headersPromise);
	const headersMap = new Map(headersList);
	const isAuthenticated = headersMap.get('x-is-authenticated');

	if (!isAuthenticated) {
		// don't error here, this won't be available during prefetches
		return { isAuthenticated: false };
	}

	return { isAuthenticated: isAuthenticated === 'true' };
}
