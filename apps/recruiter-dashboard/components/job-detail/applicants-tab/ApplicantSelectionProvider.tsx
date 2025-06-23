import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type ApplicantSelectionContextType = {
	selectedApplicants: Set<string>;
	setSelectedApplicants: (applicants: Set<string>) => void;
};

const ApplicantSelectionContext = createContext<
	ApplicantSelectionContextType | undefined
>(undefined);

export const ApplicantSelectionProvider = ({
	children,
}: { children: ReactNode }) => {
	const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(
		new Set(),
	);
	return (
		<ApplicantSelectionContext.Provider
			value={{
				selectedApplicants,
				setSelectedApplicants,
			}}
		>
			{children}
		</ApplicantSelectionContext.Provider>
	);
};

export const useApplicantSelection = (): ApplicantSelectionContextType => {
	const context = useContext(ApplicantSelectionContext);
	if (!context) {
		throw new Error(
			"useApplicantSelection must be used within a ApplicantSelectionProvider",
		);
	}
	return context;
};
