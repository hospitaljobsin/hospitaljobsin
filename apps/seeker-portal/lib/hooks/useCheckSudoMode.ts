import { useRouter } from '@bprogress/next';
import { usePathname } from 'next/navigation';
import { env } from '../env/client';
import links from '../links';
import { isSudoModeActive } from '../sudoMode';

export function useCheckSudoMode() {
	const router = useRouter();
	const pathname = usePathname();

	function checkSudoMode(sudoModeExpiresAt: string | null): boolean {
		if (isSudoModeActive(sudoModeExpiresAt)) {
			// we are in sudo mode already
			return true;
		}

		// redirect to sudo mode request page
		router.push(links.requestSudo(`${env.NEXT_PUBLIC_URL}${pathname}`));
		return false;
	}

	return { checkSudoMode };
}
