export function isSudoModeActive(sudoModeExpiresAt: string | null): boolean {
	if (sudoModeExpiresAt != null && new Date() < new Date(sudoModeExpiresAt)) {
		// we are in sudo mode already
		return true;
	}
	return false;
}
