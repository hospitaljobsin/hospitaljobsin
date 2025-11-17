export async function handler() {
	const cmsUrl = process.env.CMS_URL;
	const cronSecret = process.env.CRON_SECRET;

	const response = await fetch(`${cmsUrl}/api/payload-jobs/run`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cronSecret}`
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to invoke payload jobs: ${response.status} ${response.statusText}`);
	}

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Payload jobs invoked successfully' })
	};
}
