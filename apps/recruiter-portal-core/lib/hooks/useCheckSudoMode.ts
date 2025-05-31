import { usePathname } from "next/navigation";
import { env } from "../env/client";
import links from "../links";
import { isSudoModeActive } from "../sudoMode";

export function useCheckSudoMode() {
	const pathname = usePathname();

	const returnTo = `${env.NEXT_PUBLIC_URL}${pathname}`;

	function checkSudoMode(sudoModeExpiresAt: string | null): boolean {
		if (isSudoModeActive(sudoModeExpiresAt)) {
			// we are in sudo mode already
			return true;
		}

		// redirect to sudo mode request page
		window.location.href = links.accountSettingsRequestSudo(returnTo);
		return false;
	}

	return { checkSudoMode };
}
