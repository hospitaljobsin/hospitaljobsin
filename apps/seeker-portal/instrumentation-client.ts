// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { env } from "./lib/env/client";

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
	api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
	defaults: "2025-05-24",
	autocapture: true,
	cross_subdomain_cookie: true,
	secure_cookie: true,
	persistence: "localStorage+cookie",
});

// Register portal-specific property
posthog.register({
	app: "seeker-portal",
});

Sentry.init({
	dsn: env.NEXT_PUBLIC_SENTRY_DSN,
	environment: env.NEXT_PUBLIC_ENVIRONMENT,
	// Add optional integrations for additional features
	integrations: [
		Sentry.replayIntegration(),
		Sentry.graphqlClientIntegration({
			endpoints: [env.NEXT_PUBLIC_API_URL, /\/graphql$/],
		}),
		Sentry.browserTracingIntegration(),
	],

	// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
	tracesSampleRate: 1.0,

	// Define how likely Replay events are sampled.
	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// Define how likely Replay events are sampled when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
