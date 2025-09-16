'use client';

import type { ReactNode } from 'react';
import JobAlertFormContext from './JobAlertFormMachine';

interface JobAlertFormProviderProps {
	children: ReactNode;
}

export default function JobAlertFormProvider({ children }: JobAlertFormProviderProps) {
	return <JobAlertFormContext.Provider>{children}</JobAlertFormContext.Provider>;
}
