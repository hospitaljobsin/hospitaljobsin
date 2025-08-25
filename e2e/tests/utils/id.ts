// generate unique id across shards, workers, and projects
export function generateGlobalId(
	workerIndex: number,
	projectName: string,
	shard: number,
): string {
	// Create a unique ID that combines shard, worker, project, and timestamp
	// This ensures uniqueness across all shards, workers, projects, and time
	const timestamp = Date.now();
	return `${shard}-${workerIndex}-${projectName}-${timestamp}`;
}
