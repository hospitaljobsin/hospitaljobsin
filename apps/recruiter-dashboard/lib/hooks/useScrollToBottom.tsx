import { Role } from "@copilotkit/runtime-client-gql";
import { useEffect, useRef } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function useScrollToBottom(messages: any[]) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	const isProgrammaticScrollRef = useRef(false);
	const isUserScrollUpRef = useRef(false);

	const scrollToBottom = () => {
		if (messagesContainerRef.current && messagesEndRef.current) {
			isProgrammaticScrollRef.current = true;
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	const handleScroll = () => {
		if (isProgrammaticScrollRef.current) {
			isProgrammaticScrollRef.current = false;
			return;
		}

		if (messagesContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				messagesContainerRef.current;
			isUserScrollUpRef.current = scrollTop + clientHeight < scrollHeight;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (container) {
				container.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) {
			return;
		}

		const mutationObserver = new MutationObserver(() => {
			if (!isUserScrollUpRef.current) {
				scrollToBottom();
			}
		});

		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
			characterData: true,
		});

		return () => {
			mutationObserver.disconnect();
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		isUserScrollUpRef.current = false;
		scrollToBottom();
	}, [
		messages.filter((m) => m.isTextMessage() && m.role === Role.User).length,
	]);

	return { messagesEndRef, messagesContainerRef };
}
