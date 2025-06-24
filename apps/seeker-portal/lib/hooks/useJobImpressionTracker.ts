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

			navigator.sendBeacon?.(
				`${process.env.NEXT_PUBLIC_API_URL}/organizations/${slug}/jobs/${jobSlug}/log_view_start`,
				new Blob([JSON.stringify({ impression_id: impressionIdRef.current })], {
					type: "application/json",
				}),
			);
		};

		const sendLogViewEnd = () => {
			if (!hasStartedRef.current || hasEndedRef.current) return;
			hasEndedRef.current = true;

			navigator.sendBeacon?.(
				`${process.env.NEXT_PUBLIC_API_URL}/organizations/${slug}/jobs/${jobSlug}/log_view_end`,
				new Blob([JSON.stringify({ impression_id: impressionIdRef.current })], {
					type: "application/json",
				}),
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
