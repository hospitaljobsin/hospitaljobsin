import * as Sentry from "@sentry/nextjs";
import { initSentry } from "./sentry.server.config";

export const onRequestError = Sentry.captureRequestError;

export async function register() {
	initSentry(process.env.NEXT_RUNTIME as "nodejs" | "edge");
}
