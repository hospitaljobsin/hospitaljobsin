export function calculateReadingTime(text: string): number {
	if (!text) return 0;

	const plainText = text.replace(/<[^>]+>/g, '');
	const wordCount = plainText.trim().split(/\s+/).length;
	const wordsPerMinute = 200;

	return Math.ceil(wordCount / wordsPerMinute);
}
