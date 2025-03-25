import { useRouter } from "@bprogress/next";
import { usePathname } from "next/navigation";
import links from "../links";
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
		router.push(links.requestSudo(pathname));
		return false;
	}

	return { checkSudoMode };
}
