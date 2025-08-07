import type { RecordSourceSelectorProxy } from "relay-runtime";

export function findAllConnectionIds(
	store: RecordSourceSelectorProxy,
	connectionKey: string,
	parentId: string,
) {
	const ids: string[] = [];
	const value = store.get(parentId);
	if (value !== undefined) {
		Object.entries(value).forEach((param) => {
			if (param[0].startsWith(`__${connectionKey}_connection`)) {
				ids.push(param[1].__ref);
				return;
			}
		});
	}
	return ids;
}
