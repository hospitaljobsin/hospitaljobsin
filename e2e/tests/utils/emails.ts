import { env } from "@/lib/env";

/**
 * Email utility functions for end-to-end testing.
 *
 * These functions handle email operations in both testing and staging environments.
 * The findLastEmail function now uses native fetch API instead of Playwright request context
 * to avoid "Target page, context or browser has been closed" errors.
 */

export type Email = {
	id: string;
	recipients: string[];
	subject: string;
	text: string | undefined;
	html: string | undefined;
};

export type MailboxMessage = {
	id: string;
	sender: string;
	recipients: string[];
	subject: string;
	html_body: string;
	text_body: string;
};

// Local record of registered emails to avoid duplicate registrations
const registeredEmails = new Set<string>();

/**
 * Register an email account using the appropriate method based on environment.
 * This function does nothing in testing environment and registers with mailinator in staging.
 * Avoids registering the same email twice by maintaining a local record.
 */
export function registerEmailAddress({
	email,
}: {
	email: string;
	password?: string;
}): void {
	// Check if email is already registered locally
	if (registeredEmails.has(email)) {
		console.log(`Email ${email} already registered, skipping registration`);
		return;
	}

	// Do nothing in testing environment, but still track locally
	registeredEmails.add(email);
}

/**
 * Clear the local record of registered emails.
 * Useful for test cleanup or when starting fresh.
 */
export function clearRegisteredEmails(): void {
	registeredEmails.clear();
}

/**
 * Get the current list of registered emails.
 * Useful for debugging or verification purposes.
 */
export function getRegisteredEmails(): string[] {
	return Array.from(registeredEmails);
}

export function generateUniqueEmail(baseLabel: string): string {
	return `${baseLabel}@outlook.com`;
}

/**
 * Find the last email using the appropriate method based on environment.
 * This is the only public API - works identically in both testing and staging environments.
 * Returns a unified Email type regardless of the underlying email service.
 * Now uses native fetch API instead of Playwright request context.
 */
export async function findLastEmail({
	filter,
	inboxAddress,
	timeout = 10_000,
}: {
	filter?: (email: Email) => boolean;
	inboxAddress: string;
	timeout?: number;
}): Promise<Email | null> {
	return findLastEmailTesting({ filter, inboxAddress, timeout });
}

/**
 * Find last email using mailcatcher for testing environment.
 * Now uses native fetch API instead of Playwright request context.
 */
async function findLastEmailTesting({
	filter,
	inboxAddress,
	timeout = 10_000,
}: {
	filter?: (email: Email) => boolean;
	inboxAddress: string;
	timeout?: number;
}): Promise<Email | null> {
	const timeoutPromise = new Promise<Email | null>((resolve) =>
		setTimeout(() => resolve(null), timeout),
	);

	const checkEmails = async () => {
		const startTime = Date.now();
		const maxAttempts = Math.ceil(timeout / 100); // Calculate max attempts based on timeout
		let attempts = 0;

		while (attempts < maxAttempts) {
			try {
				attempts++;

				// Check if we've exceeded the timeout before making the request
				if (Date.now() - startTime >= timeout) {
					return null;
				}

				const response = await fetch(`${env.API_BASE_URL}/mailbox/messages`);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const resp: MailboxMessage[] = await response.json();

				const emails: Email[] = resp.map((m) => ({
					id: m.id,
					recipients: m.recipients,
					subject: m.subject,
					text: m.text_body,
					html: m.html_body,
				}));

				// Apply default filter to ensure emails are sent to the specified inbox
				let filteredEmails = emails.filter((e) =>
					e.recipients.some(
						(recipient) =>
							recipient.includes(`${inboxAddress}`) ||
							recipient === inboxAddress,
					),
				);

				// Apply additional custom filter if provided
				if (filter) {
					filteredEmails = filteredEmails.filter(filter);
				}

				const email = filteredEmails[filteredEmails.length - 1];
				if (email) {
					return email;
				}

				// Wait for 100ms before checking again
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				attempts++;

				// For fetch errors, log and continue if we haven't exceeded max attempts
				if (attempts < maxAttempts) {
					console.warn("Error checking emails:", error);
					await new Promise((resolve) => setTimeout(resolve, 100));
				} else {
					console.warn("Max attempts reached, stopping email check");
					return null;
				}
			}
		}

		return null;
	};

	return Promise.race([timeoutPromise, checkEmails()]);
}
