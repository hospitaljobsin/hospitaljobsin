'use client';

import { createActorContext } from '@xstate/react';
import { createMachine } from 'xstate';
import { z } from 'zod';

// Form schema for validation
export const createAlertSchema = z
	.object({
		searchTerm: z.string().min(1, 'Search term is required'),
		jobType: z
			.array(z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'LOCUM']))
			.optional()
			.nullable(),
		workMode: z
			.array(z.enum(['HYBRID', 'OFFICE', 'REMOTE']))
			.optional()
			.nullable(),
		location: z.string().optional().nullable(),
		minExperience: z.number().nonnegative().optional().nullable(),
		maxExperience: z.number().positive().optional().nullable(),
		minSalary: z.number().nonnegative().optional().nullable(),
		maxSalary: z.number().positive().optional().nullable(),
		frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY'])
	})
	.refine(
		data => {
			// At least one filter should be present
			return Boolean(
				data.searchTerm ||
					(data.jobType && data.jobType.length > 0) ||
					(data.workMode && data.workMode.length > 0) ||
					data.location ||
					data.minExperience ||
					data.maxExperience ||
					data.minSalary ||
					data.maxSalary
			);
		},
		{
			message: 'Please add at least one job search criteria',
			path: ['searchTerm']
		}
	)
	.refine(
		data => {
			// If both min and max experience are provided, max should be >= min
			if (data.minExperience != null && data.maxExperience != null) {
				return data.maxExperience >= data.minExperience;
			}
			return true;
		},
		{
			message: 'Maximum experience must be greater than or equal to minimum experience',
			path: ['maxExperience']
		}
	)
	.refine(
		data => {
			// If both min and max salary are provided, max should be >= min
			if (data.minSalary != null && data.maxSalary != null) {
				return data.maxSalary >= data.minSalary;
			}
			return true;
		},
		{
			message: 'Maximum salary must be greater than or equal to minimum salary',
			path: ['maxSalary']
		}
	);

export type CreateAlertFormValues = z.infer<typeof createAlertSchema>;

// Create a very simple state machine with just the state transitions
const machine = createMachine({
	id: 'jobAlertForm',
	initial: 'step1',
	// Define an empty context since we're using react-hook-form for form state
	context: {},
	states: {
		step1: {
			on: {
				NEXT: 'step2'
			}
		},
		step2: {
			on: {
				NEXT: 'step3',
				BACK: 'step1'
			}
		},
		step3: {
			on: {
				NEXT: 'step4',
				BACK: 'step2'
			}
		},
		step4: {
			on: {
				SUBMIT: 'complete',
				BACK: 'step3'
			}
		},
		complete: {
			// Remove the final type so it doesn't stop
			// type: 'final',
			// Add RESET transition to allow going back to step1
			on: {
				RESET: 'step1'
			}
		}
	}
});

// Create an actor context for the job alert form machine
const JobAlertFormContext = createActorContext(machine);

export default JobAlertFormContext;
