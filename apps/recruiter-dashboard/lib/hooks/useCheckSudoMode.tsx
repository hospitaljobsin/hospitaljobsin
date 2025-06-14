import { usePathname } from "next/navigation";
import links from "../links";
import { isSudoModeActive } from "../sudoMode";
import useOrganization from "./useOrganization";

export function useCheckSudoMode() {
	const pathname = usePathname();
	const { organizationSlug } = useOrganization();

	// TODO: update this to include subdomain
	const returnTo = `${links.organizationDetail(organizationSlug)}${pathname}`;

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
