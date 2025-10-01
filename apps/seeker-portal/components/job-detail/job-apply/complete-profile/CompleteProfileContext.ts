'use client';

import { createActorContext } from '@xstate/react';
import { assign, createMachine } from 'xstate';

export interface ApplicationField {
	fieldName: string;
	fieldValue: string;
	isRequired: boolean;
	defaultValue: string;
}

const context = {
	currentStep: 0,
	totalSteps: 0,
	missingFields: [] as string[],
	currentFieldIndex: 0,
	applicationFields: [] as ApplicationField[],
	jobId: '',
	showReviewStep: false
};

export const completeProfileMachine = createMachine({
	initial: 'checkingProfile',
	types: {} as {
		context: typeof context;
		events:
			| { type: 'START_FORM'; missingFields: string[]; applicationFields: ApplicationField[]; jobId: string }
			| { type: 'STEP_COMPLETED' }
			| { type: 'SUBMIT_APPLICATION_FIELD'; fieldIndex: number; fieldValue: string }
			| { type: 'PREVIOUS_STEP' }
			| { type: 'REFRESH_FIELDS'; missingFields: string[]; totalSteps: number }
			| { type: 'PROCEED_TO_REVIEW' }
			| { type: 'APPLY_FOR_JOB' };
	},
	context: context,
	states: {
		checkingProfile: {
			on: {
				START_FORM: {
					target: 'activeStep',
					actions: assign({
						totalSteps: ({ event }) => event.missingFields.length + event.applicationFields.length,
						currentStep: () => 1,
						missingFields: ({ event }) => event.missingFields,
						currentFieldIndex: () => 0,
						applicationFields: ({ event }) => event.applicationFields,
						jobId: ({ event }) => event.jobId,
						showReviewStep: () => true
					})
				}
			}
		},
		activeStep: {
			on: {
				STEP_COMPLETED: [
					{
						target: 'reviewStep',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length + context.applicationFields.length
					},
					{
						target: 'activeStep',
						actions: assign({
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				REFRESH_FIELDS: {
					target: 'activeStep',
					actions: assign({
						missingFields: ({ event }) => event.missingFields,
						totalSteps: ({ event }) => event.totalSteps,
						currentFieldIndex: () => 0,
						currentStep: () => 1
					})
				},
				SUBMIT_APPLICATION_FIELD: [
					{
						target: 'reviewStep',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length + context.applicationFields.length,
						actions: assign({
							applicationFields: ({ context, event }) =>
								context.applicationFields.map((field, idx) =>
									idx === event.fieldIndex ? { ...field, fieldValue: event.fieldValue } : field
								),
							currentStep: ({ context }) => context.currentStep + 1
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							applicationFields: ({ context, event }) =>
								context.applicationFields.map((field, idx) =>
									idx === event.fieldIndex ? { ...field, fieldValue: event.fieldValue } : field
								),
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				PREVIOUS_STEP: {
					target: 'activeStep',
					actions: assign({
						currentStep: ({ context }) => Math.max(1, context.currentStep - 1),
						currentFieldIndex: ({ context }) => Math.max(0, context.currentFieldIndex - 1)
					})
				}
			}
		},

		reviewStep: {
			on: {
				APPLY_FOR_JOB: {
					target: 'completed'
				},
				PREVIOUS_STEP: {
					target: 'activeStep',
					actions: assign({
						currentStep: ({ context }) => context.currentStep - 1,
						currentFieldIndex: ({ context }) => context.currentFieldIndex - 1
					})
				}
			}
		},
		completed: {
			type: 'final'
		}
	}
});

const CompleteProfileContext = createActorContext(completeProfileMachine);

export default CompleteProfileContext;
