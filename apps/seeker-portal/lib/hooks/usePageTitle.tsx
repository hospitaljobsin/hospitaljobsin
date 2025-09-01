import { useEffect } from "react";

const usePageTitle = ({ title }: { title: string }) => {
	// selectors that retrieve the amount of unread messages and notifications...

	useEffect(() => {
		document.title = title;

		// Update favicon
		// const link: HTMLLinkElement =
		// 	document.querySelector("link[rel~='icon']") ||
		// 	document.createElement('link');
		// link.rel = 'icon';
		// link.type =
		// 	hasTalkUnviewed || hasNotificationUnviewed
		// 		? 'image/svg+xml'
		// 		: 'image/x-icon';
		// link.href = hasTalkUnviewed
		// 	? '/static/main-icons/message.svg'
		// 	: hasNotificationUnviewed
		// 		? '/static/main-icons/notification.svg'
		// 		: '/favicon.ico';
		// document.head.appendChild(link);
	}, [title]);
};
export default usePageTitle;
