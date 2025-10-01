export function getResumeProgressColor(percentage: number): 'primary' | 'warning' | 'danger' {
	if (percentage >= 80) {
		return 'primary';
	}
	if (percentage >= 50) {
		return 'warning';
	}
	return 'danger';
}
