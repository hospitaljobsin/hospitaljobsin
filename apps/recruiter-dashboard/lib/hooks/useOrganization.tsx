import { useHeaders } from "@/components/HeadersProvider";
import { use } from "react";
import { ORG_SUBDOMAIN_HEADER_NAME } from "../constants";

export default function useOrganization() {
	const { headersPromise } = useHeaders();
	const headersList = use(headersPromise);
	const headersMap = new Map(headersList);
	const organizationSlug = headersMap.get(ORG_SUBDOMAIN_HEADER_NAME);

	if (!organizationSlug) {
		throw new Error("Organization slug is required in headers");
	}

	return { organizationSlug };
}
