import type { RecordSourceSelectorProxy } from "relay-runtime";

export function findAllConnectionIds(
	store: RecordSourceSelectorProxy,
	connectionKey: string,
	parentId: string,
) {
	const ids: string[] = [];
	const value = store.get(parentId);
	if (value !== null && value !== undefined) {
		for (const [key, val] of Object.entries(value)) {
			if (key.startsWith(`__${connectionKey}_connection`)) {
				if (typeof val === "object" && val !== null && "__ref" in val) {
					ids.push((val as { __ref: string }).__ref);
				}
			}
		}
	}
	return ids;
}
