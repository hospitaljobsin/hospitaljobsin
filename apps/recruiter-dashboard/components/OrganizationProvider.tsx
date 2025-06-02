import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type OrganizationContextType = {
	organizationSlug: string;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(
	undefined,
);

export const OrganizationProvider = ({
	children,
	organizationSlug,
}: { children: ReactNode; organizationSlug: string }) => {
	return (
		<OrganizationContext.Provider
			value={{
				organizationSlug: organizationSlug,
			}}
		>
			{children}
		</OrganizationContext.Provider>
	);
};

export const useOrganization = (): OrganizationContextType => {
	const context = useContext(OrganizationContext);
	if (!context) {
		throw new Error(
			"useOrganization must be used within a OrganizationProvider",
		);
	}
	return context;
};
