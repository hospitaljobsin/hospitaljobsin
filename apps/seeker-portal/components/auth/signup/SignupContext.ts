"use client";

import { createActorContext } from "@xstate/react";
import { assign, createMachine } from "xstate";

const context = {
	email: "",
	emailVerificationToken: "",
	cooldownSeconds: 0,
	emailError: undefined as string | undefined,
	emailVerificationError: undefined as string | undefined,
};

export const signUpMachine = createMachine({
	initial: "step1",
	types: {} as {
		context: typeof context;
		events:
			| {
					type: "SUBMIT_EMAIL";
					email: string;
					cooldown: number;
			  }
			| { type: "SUBMIT_VERIFICATION"; token: string }
			| { type: "SET_RESEND_COOLDOWN"; cooldown: number }
			| { type: "EDIT_EMAIL" }
			| { type: "SET_EMAIL_ERROR"; message: string }
			| { type: "SET_VERIFICATION_TOKEN_ERROR"; message: string };
	},
	context: context,
	states: {
		step1: {
			on: {
				SUBMIT_EMAIL: {
					target: "step2",
					actions: assign({
						email: ({ event }) => event.email,
						cooldownSeconds: ({ event }) => event.cooldown,
						emailError: () => undefined,
					}),
				},
			},
		},
		step2: {
			on: {
				SUBMIT_VERIFICATION: {
					target: "step3",
					actions: assign({
						emailVerificationToken: ({ event }) => event.token,
						emailVerificationError: () => undefined,
					}),
				},
				SET_RESEND_COOLDOWN: {
					actions: assign({
						cooldownSeconds: ({ event }) => event.cooldown,
					}),
				},
				EDIT_EMAIL: {
					target: "step1",
					actions: assign({
						email: ({ context }) => context.email,
						emailVerificationToken: () => "",
						cooldownSeconds: () => 0,
					}),
				},
				SET_EMAIL_ERROR: {
					target: "step1",
					actions: assign({
						emailError: ({ event }) => event.message,
					}),
				},
			},
		},
		step3: {
			on: {
				SET_EMAIL_ERROR: {
					target: "step1",
					actions: assign({
						emailError: ({ event }) => event.message,
					}),
				},
				SET_VERIFICATION_TOKEN_ERROR: {
					target: "step2",
					actions: assign({
						emailVerificationError: ({ event }) => event.message,
					}),
				},
			},
		},
	},
});

const SignupContext = createActorContext(signUpMachine);

export default SignupContext;
