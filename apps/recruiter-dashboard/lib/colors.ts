export function getAnalysisColor(score: number) {
	if (score >= 0.7) {
		return "success";
	}
	if (score >= 0.5) {
		return "warning";
	}
	return "default";
}
