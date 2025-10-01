'use client';

import { createActorContext } from '@xstate/react';
import { assign, createMachine } from 'xstate';

const context = {
	resumeUrl: '',
	dateOfBirth: '',
	address: '',
	education: [] as Array<{ degree: string; institution: string; year: string }>,
	locationsOpenToWork: [] as string[],
	openToRelocationAnywhere: false,
	professionalSummary: '',
	headline: '',
	currentStep: 0,
	totalSteps: 0,
	missingFields: [] as string[],
	currentFieldIndex: 0,
	onApply: null as (() => void) | null
};

export const completeProfileMachine = createMachine({
	initial: 'checkingProfile',
	types: {} as {
		context: typeof context;
		events:
			| { type: 'START_FORM'; missingFields: string[]; totalSteps: number; onApply?: () => void }
			| { type: 'SUBMIT_RESUME'; resumeUrl: string }
			| { type: 'SUBMIT_DATE_OF_BIRTH'; dateOfBirth: string }
			| { type: 'SUBMIT_ADDRESS'; address: string }
			| { type: 'SUBMIT_EDUCATION'; education: Array<{ degree: string; institution: string; year: string }> }
			| { type: 'SUBMIT_CAREER_PROFILE'; locationsOpenToWork: string[]; openToRelocationAnywhere: boolean }
			| { type: 'SUBMIT_PROFESSIONAL_SUMMARY'; professionalSummary: string }
			| { type: 'SUBMIT_HEADLINE'; headline: string }
			| { type: 'NEXT_STEP' }
			| { type: 'PREVIOUS_STEP' }
			| { type: 'REFRESH_FIELDS'; missingFields: string[]; totalSteps: number }
			| { type: 'APPLY_FOR_JOB' };
	},
	context: context,
	states: {
		checkingProfile: {
			on: {
				START_FORM: {
					target: 'activeStep',
					actions: assign({
						totalSteps: ({ event }) => event.totalSteps,
						currentStep: () => 1,
						missingFields: ({ event }) => event.missingFields,
						currentFieldIndex: () => 0,
						onApply: ({ event }) => event.onApply || null
					})
				}
			}
		},
		activeStep: {
			on: {
				SUBMIT_RESUME: {
					target: 'activeStep',
					actions: assign({
						resumeUrl: ({ event }) => event.resumeUrl,
						currentStep: ({ context }) => context.currentStep + 1,
						currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
					})
				},
				REFRESH_FIELDS: {
					target: 'activeStep',
					actions: assign({
						missingFields: ({ event }) => event.missingFields,
						totalSteps: ({ event }) => event.totalSteps,
						currentFieldIndex: () => 0,
						currentStep: () => 1
					})
				},
				SUBMIT_DATE_OF_BIRTH: [
					{
						target: 'completed',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length,
						actions: assign({
							dateOfBirth: ({ event }) => event.dateOfBirth
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							dateOfBirth: ({ event }) => event.dateOfBirth,
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				SUBMIT_ADDRESS: [
					{
						target: 'completed',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length,
						actions: assign({
							address: ({ event }) => event.address
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							address: ({ event }) => event.address,
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				SUBMIT_EDUCATION: [
					{
						target: 'completed',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length,
						actions: assign({
							education: ({ event }) => event.education
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							education: ({ event }) => event.education,
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				SUBMIT_CAREER_PROFILE: [
					{
						target: 'completed',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length,
						actions: assign({
							locationsOpenToWork: ({ event }) => event.locationsOpenToWork,
							openToRelocationAnywhere: ({ event }) => event.openToRelocationAnywhere
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							locationsOpenToWork: ({ event }) => event.locationsOpenToWork,
							openToRelocationAnywhere: ({ event }) => event.openToRelocationAnywhere,
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				SUBMIT_PROFESSIONAL_SUMMARY: [
					{
						target: 'completed',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length,
						actions: assign({
							professionalSummary: ({ event }) => event.professionalSummary
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							professionalSummary: ({ event }) => event.professionalSummary,
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				SUBMIT_HEADLINE: [
					{
						target: 'completed',
						guard: ({ context }) => context.currentFieldIndex + 1 >= context.missingFields.length,
						actions: assign({
							headline: ({ event }) => event.headline
						})
					},
					{
						target: 'activeStep',
						actions: assign({
							headline: ({ event }) => event.headline,
							currentStep: ({ context }) => context.currentStep + 1,
							currentFieldIndex: ({ context }) => context.currentFieldIndex + 1
						})
					}
				],
				APPLY_FOR_JOB: {
					target: 'completed'
				},
				PREVIOUS_STEP: {
					target: 'activeStep',
					actions: assign({
						currentStep: ({ context }) => Math.max(1, context.currentStep - 1),
						currentFieldIndex: ({ context }) => Math.max(0, context.currentFieldIndex - 1)
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
