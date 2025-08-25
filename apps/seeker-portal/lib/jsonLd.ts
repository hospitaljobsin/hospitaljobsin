import type { JobType } from "@/__generated__/pageJobDetailMetadataFragment.graphql";
import type { JobPosting } from "schema-dts";

export function getEmploymentType(type: JobType): JobPosting["employmentType"] {
	switch (type) {
		case "FULL_TIME":
			return "FULL_TIME";
		case "PART_TIME":
			return "PART_TIME";
		case "CONTRACT":
			return "CONTRACT";
		case "INTERNSHIP":
			return "INTERN";
		case "LOCUM":
			return "OTHER";
		default:
			return "FULL_TIME";
	}
}
