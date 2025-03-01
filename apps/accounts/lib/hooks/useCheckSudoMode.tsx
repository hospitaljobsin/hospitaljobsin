import { usePathname, useRouter } from "next/navigation";

export function useCheckSudoMode() {
	const router = useRouter();
	const pathname = usePathname();

	function checkSudoMode(sudoModeExpiresAt: Date | null): boolean {
		if (sudoModeExpiresAt != null && new Date() < sudoModeExpiresAt) {
			// we are in sudo mode already
			return true;
		}

		// redirect to sudo mode request page
		router.push(`/request-sudo?return_to=${encodeURIComponent(pathname)}`);
		return false;
	}

	return { checkSudoMode };
}
