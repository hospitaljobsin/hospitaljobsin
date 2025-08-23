import { env } from "@/lib/env";
import type { APIRequestContext } from "@playwright/test";
import {
	GetInboxRequest,
	GetMessageRequest,
	type Inbox,
	MailinatorClient,
	type Message,
} from "mailinator-client";
import type { IRestResponse } from "typed-rest-client";

export type Email = {
	id: string;
	recipients: string[];
	subject: string;
	html: string | undefined;
};

// Initialize mailinator client for staging environment
const mailinatorClient = new MailinatorClient(env.MAILINATOR_API_KEY);

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
	if (env.ENVIRONMENT === "staging") {
		if (!env.MAILINATOR_PRIVATE_DOMAIN) {
			throw new Error(
				"MAILINATOR_PRIVATE_DOMAIN environment variable is required for staging environment",
			);
		}
		return `${baseLabel}@${env.MAILINATOR_PRIVATE_DOMAIN}`;
	}

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
	if (env.ENVIRONMENT === "staging") {
		return findLastEmailStaging({ filter, inboxAddress, timeout, request });
	}

	return findLastEmailTesting({ request, filter, inboxAddress, timeout });
}

async function getTestingEmailHtml({
	request,
	messageId,
}: {
	request?: APIRequestContext;
	messageId: string;
}): Promise<string | undefined> {
	if (env.ENVIRONMENT === "staging") {
		if (!env.MAILINATOR_API_KEY || !env.MAILINATOR_PRIVATE_DOMAIN) {
			console.warn("Mailinator configuration missing for staging environment");
			return undefined;
		}

		try {
			const response: IRestResponse<Message> = await mailinatorClient.request(
				new GetMessageRequest(env.MAILINATOR_PRIVATE_DOMAIN, messageId),
			);

			if (!response.result) {
				return undefined;
			}

			const messageData = response.result;

			// Extract HTML content from message parts
			let html = "";

			// Look for HTML content in the parts array
			if (messageData.parts && Array.isArray(messageData.parts)) {
				for (const part of messageData.parts) {
					// Check if this part contains HTML content
					if (part.headers && typeof part.headers === "object") {
						const headers = part.headers as Record<string, string>;
						const contentType =
							headers["content-type"] ||
							headers["Content-Type"] ||
							headers["CONTENT-TYPE"];

						if (contentType?.includes("text/html")) {
							html = part.body || "";
							break;
						}
					}
				}
			}

			return html || undefined;
		} catch (error) {
			console.warn(`Failed to fetch HTML for email ${messageId}:`, error);
			return undefined;
		}
	}

	if (!request) {
		throw new Error("request is required for testing environment");
	}

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

async function getStagingEmailHtml({
	email,
}: {
	email: Email;
}): Promise<string | undefined> {
	if (!env.MAILINATOR_PRIVATE_DOMAIN) {
		throw new Error(
			"MAILINATOR_PRIVATE_DOMAIN environment variable is required for staging environment",
		);
	}

	try {
		// Extract HTML content from message parts
		const resp: IRestResponse<Message> = await mailinatorClient.request(
			new GetMessageRequest(env.MAILINATOR_PRIVATE_DOMAIN, email.id),
		);
		const message = resp.result;
		if (!message) {
			return undefined;
		}
		let html = "";

		// Look for HTML content in the parts array
		if (message.parts && Array.isArray(message.parts)) {
			for (const part of message.parts) {
				// Check if this part contains HTML content
				if (part.headers && typeof part.headers === "object") {
					const headers = part.headers as Record<string, string>;
					const contentType =
						headers["content-type"] ||
						headers["Content-Type"] ||
						headers["CONTENT-TYPE"];

					if (contentType?.includes("text/html")) {
						html = part.body || "";
						break;
					}
				}
			}
		}

		return html || undefined;
	} catch (error) {
		console.warn(`Failed to fetch HTML for email ${email.id}:`, error);
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

/**
 * Find last email using mailinator for staging environment.
 */
async function findLastEmailStaging({
	filter,
	request,
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
				const mailbox = await getMailbox(inboxAddress);

				if (mailbox.messages.length === 0) {
					// Wait for 100ms before checking again
					await new Promise((resolve) => setTimeout(resolve, 100));
					continue;
				}

				let filteredEmails = mailbox.messages;
				if (filter) {
					filteredEmails = mailbox.messages.filter(filter);
				}

				if (filteredEmails.length > 0) {
					const lastEmail = filteredEmails[filteredEmails.length - 1];
					return {
						...lastEmail,
						html: await getStagingEmailHtml({ email: lastEmail }),
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
/**
 * Internal function to get mailbox contents using mailinator for staging environment.
 */
async function getMailbox(
	email: string,
): Promise<{ address: string; messageCount: number; messages: Array<Email> }> {
	if (!env.MAILINATOR_API_KEY || !env.MAILINATOR_PRIVATE_DOMAIN) {
		throw new Error("Mailinator configuration missing for staging environment");
	}

	try {
		// Extract inbox name from email address
		const inboxName = email.split("@")[0];

		// Get inbox from mailinator
		const response: IRestResponse<Inbox> = await mailinatorClient.request(
			new GetInboxRequest(
				env.MAILINATOR_PRIVATE_DOMAIN,
				inboxName,
				undefined,
				50, // max limit is 99
			),
		);

		if (!response.result) {
			return {
				address: email,
				messageCount: 0,
				messages: [],
			};
		}

		const inboxData = response.result;
		const messages = inboxData.msgs || [];

		return {
			address: email,
			messageCount: messages.length,
			messages: messages.map((message) => ({
				id: message.id,
				recipients: [message.to],
				subject: message.subject,
				html: undefined,
			})),
		};
	} catch (error) {
		console.error("Error getting mailbox:", error);
		throw error;
	}
}
