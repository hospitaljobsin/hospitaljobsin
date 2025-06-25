import type { useJobImpressionTrackerEndMutation } from "@/__generated__/useJobImpressionTrackerEndMutation.graphql";
import type { useJobImpressionTrackerStartMutation } from "@/__generated__/useJobImpressionTrackerStartMutation.graphql";
import { useEffect, useRef } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { v4 as uuidv4 } from "uuid";

const LogJobViewStartMutation = graphql`
	mutation useJobImpressionTrackerStartMutation($impressionId: String!, $jobId: ID!) {
		logJobViewStart(impressionId: $impressionId, jobId: $jobId) {
			__typename
		}
	}
`;

const LogJobViewEndMutation = graphql`
	mutation useJobImpressionTrackerEndMutation($impressionId: String!, $jobId: ID!) {
		logJobViewEnd(impressionId: $impressionId, jobId: $jobId) {
			__typename
		}
	}
`;

export const useImpressionTracker = (jobId?: string) => {
	const [commitStartMutation, isStartMutationInFlight] =
		useMutation<useJobImpressionTrackerStartMutation>(LogJobViewStartMutation);
	const [commitEndMutation, isEndMutationInFlight] =
		useMutation<useJobImpressionTrackerEndMutation>(LogJobViewEndMutation);

	const impressionIdRef = useRef(uuidv4());
	const hasStartedRef = useRef(false);
	const hasEndedRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!jobId) return;

		const sendLogViewStart = () => {
			if (hasStartedRef.current) return;
			hasStartedRef.current = true;

			commitStartMutation({
				variables: {
					impressionId: impressionIdRef.current,
					jobId: jobId,
				},
			});
		};

		const sendLogViewEnd = () => {
			if (!hasStartedRef.current || hasEndedRef.current) return;
			hasEndedRef.current = true;

			commitEndMutation({
				variables: {
					impressionId: impressionIdRef.current,
					jobId: jobId,
				},
			});
		};

		// Delay log_view_start until next tick to allow consistent ordering
		const startTimeout = setTimeout(sendLogViewStart, 0);

		// Event handlers
		window.addEventListener("beforeunload", sendLogViewEnd);
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "hidden") {
				sendLogViewEnd();
			}
		});

		return () => {
			clearTimeout(startTimeout);
			sendLogViewEnd();
			window.removeEventListener("beforeunload", sendLogViewEnd);
			document.removeEventListener("visibilitychange", sendLogViewEnd);
		};
	}, [jobId]);
};

export default useImpressionTracker;
