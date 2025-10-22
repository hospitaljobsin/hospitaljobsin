export function isValidBase64Cursor(cursor: string) {
	// Basic base64 pattern (standard, not URL-safe)
	const base64Pattern = /^[A-Za-z0-9+/=]{10,}$/; // minimum 10 chars to filter garbage

	if (!base64Pattern.test(cursor)) return false;

	try {
		// Try decoding it
		const decoded = atob(cursor);

		// Optional: if your backend encodes cursors as JSON strings, you can try JSON.parse
		// const json = JSON.parse(decoded);
		// if (typeof json !== 'object' || !json) return false;

		return true;
	} catch (err) {
		return false;
	}
}
