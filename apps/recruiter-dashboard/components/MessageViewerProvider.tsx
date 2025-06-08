"use client";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

type MessageViewerContextType = {
	showMessageViewer: boolean;
	setShowMessageViewer: Dispatch<SetStateAction<boolean>>;
};

const MessageViewerContext = createContext<
	MessageViewerContextType | undefined
>(undefined);

export const MessageViewerProvider = ({
	children,
}: { children: ReactNode }) => {
	const [showMessageViewer, setShowMessageViewer] = useState(false);

	return (
		<MessageViewerContext.Provider
			value={{
				showMessageViewer: showMessageViewer,
				setShowMessageViewer: setShowMessageViewer,
			}}
		>
			{children}
		</MessageViewerContext.Provider>
	);
};

export const useMessageViewer = (): MessageViewerContextType => {
	const context = useContext(MessageViewerContext);
	if (!context) {
		throw new Error("useHeaders must be used within a MessageViewerProvider");
	}
	return context;
};
