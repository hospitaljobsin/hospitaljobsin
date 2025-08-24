import { env } from "@/lib/env";

// generate unique id across shards, workers, and projects
export function generateGlobalId(
	workerIndex: number,
	projectName: string,
): string {
	// Create a unique ID that combines shard, worker, project, and timestamp
	// This ensures uniqueness across all shards, workers, projects, and time
	const timestamp = Date.now();
	return `${env.PLAYWRIGHT_SHARD}-${workerIndex}-${projectName}-${timestamp}`;
}
