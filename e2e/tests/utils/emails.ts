import { env } from "@/lib/env";
import type { APIRequestContext } from "@playwright/test";

export type Email = {
	id: string;
	recipients: string[];
	subject: string;
	html: string | undefined;
};

// Local record of registered emails to avoid duplicate registrations
const registeredEmails = new Set<string>();

/**
 * Register an email account using the appropriate method based on environment.
 * This function does nothing in testing environment and registers with mailinator in staging.
 * Avoids registering the same email twice by maintaining a local record.
 */
export async function registerEmailAddress({
	email,
}: {
	email: string;
	password?: string;
}): Promise<void> {
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

export async function generateUniqueEmail(baseLabel: string): Promise<string> {
	return `${baseLabel}@outlook.com`;
}

/**
 * Find the last email using the appropriate method based on environment.
 * This is the only public API - works identically in both testing and staging environments.
 * Returns a unified Email type regardless of the underlying email service.
 */
export async function findLastEmail({
	request,
	filter,
	inboxAddress,
	timeout = 10_000,
}: {
	request: APIRequestContext;
	filter?: (email: Email) => boolean;
	inboxAddress: string;
	timeout?: number;
}): Promise<Email | null> {
	return findLastEmailTesting({ request, filter, inboxAddress, timeout });
}

async function getTestingEmailHtml({
	request,
	messageId,
}: {
	request: APIRequestContext;
	messageId: string;
}): Promise<string | undefined> {
	// For testing environment, fetch HTML from mailcatcher
	try {
		const response = await request.get(
			`${env.MAILCATCHER_BASE_URL}/messages/${messageId}.html`,
		);

		if (response.ok()) {
			return await response.text();
		}

		return undefined;
	} catch (error) {
		console.warn(`Failed to fetch HTML for email ${messageId}:`, error);
		return undefined;
	}
}
/**
 * Find last email using mailcatcher for testing environment.
 */
async function findLastEmailTesting({
	request,
	filter,
	inboxAddress,
	timeout,
}: {
	request: APIRequestContext;
	filter?: (email: Email) => boolean;
	inboxAddress: string;
	timeout?: number;
}): Promise<Email | null> {
	const timeoutPromise = new Promise<Email | null>((resolve) =>
		setTimeout(() => resolve(null), timeout),
	);

	const checkEmails = async () => {
		while (true) {
			try {
				const response = await request.get(
					`${env.MAILCATCHER_BASE_URL}/messages`,
				);
				const emails: Email[] = await response.json();

				// Apply default filter to ensure emails are sent to the specified inbox
				let filteredEmails = emails.filter((e) =>
					e.recipients.some(
						(recipient) =>
							recipient.includes(`<${inboxAddress}>`) ||
							recipient === inboxAddress,
					),
				);

				// Apply additional custom filter if provided
				if (filter) {
					filteredEmails = filteredEmails.filter(filter);
				}

				const email = filteredEmails[filteredEmails.length - 1];
				if (email) {
					return {
						...email,
						html: await getTestingEmailHtml({
							request,
							// Fetch HTML content for the email
							messageId: String(email.id),
						}),
					};
				}

				// Wait for 100ms before checking again
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				console.warn("Error checking emails:", error);
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		}
	};

	return Promise.race([timeoutPromise, checkEmails()]);
}
