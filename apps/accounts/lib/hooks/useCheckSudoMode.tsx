import { usePathname, useRouter } from "next/navigation";
import { isSudoModeActive } from "../sudoMode";

export function useCheckSudoMode() {
	const router = useRouter();
	const pathname = usePathname();

	function checkSudoMode(sudoModeExpiresAt: string | null): boolean {
		if (isSudoModeActive(sudoModeExpiresAt)) {
			// we are in sudo mode already
			return true;
		}

		// redirect to sudo mode request page
		router.push(`/request-sudo?return_to=${encodeURIComponent(pathname)}`);
		return false;
	}

	return { checkSudoMode };
}
