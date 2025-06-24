import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export const useImpressionTracker = (slug?: string, jobSlug?: string) => {
	const impressionIdRef = useRef(uuidv4());
	const hasStartedRef = useRef(false);
	const hasEndedRef = useRef(false);

	useEffect(() => {
		if (!slug || !jobSlug) return;

		const sendLogViewStart = () => {
			if (hasStartedRef.current) return;
			hasStartedRef.current = true;

			fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/organizations/${slug}/jobs/${jobSlug}/log_view_start`,
				{
					method: "POST",
					body: JSON.stringify({ impression_id: impressionIdRef.current }),
					keepalive: true, // <== important!
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					credentials: "include",
				},
			);
		};

		const sendLogViewEnd = () => {
			if (!hasStartedRef.current || hasEndedRef.current) return;
			hasEndedRef.current = true;

			fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/organizations/${slug}/jobs/${jobSlug}/log_view_end`,
				{
					method: "POST",
					body: JSON.stringify({ impression_id: impressionIdRef.current }),
					keepalive: true, // <== important!
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					credentials: "include",
				},
			);
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
	}, [slug, jobSlug]);
};

export default useImpressionTracker;
