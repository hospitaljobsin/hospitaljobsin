import { env } from "@/lib/env";
import Mailjs from "@cemalgnlts/mailjs";
import type { APIRequestContext } from "@playwright/test";

export type Email = {
	id: number;
	recipients: string[];
	subject: string;
	html: string | undefined;
};

// Initialize mailjs instance for staging environment
const mailjs = new Mailjs({
	rateLimitRetries: 5,
});

/**
 * Register an email account using the appropriate method based on environment.
 * This function does nothing in testing environment and registers with mailjs in staging.
 */
export async function registerNewEmail({
	label,
	password = env.MAILJS_PASSWORD,
}: {
	label: string;
	password?: string;
}): Promise<string> {
	if (env.ENVIRONMENT === "staging") {
		return await registerEmailStaging({ label, password });
	}
	// Do nothing in testing environment
	return `${label}@outlook.com`;
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
	timeout = 5000,
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

/**
 * Get the HTML content of an email by its ID.
 * This function works in both testing and staging environments.
 */
export async function getEmailHtml({
	request,
	messageId,
}: {
	request: APIRequestContext;
	messageId: string;
}): Promise<string | undefined> {
	if (env.ENVIRONMENT === "staging") {
		const message = await mailjs.getMessage(messageId);

		if (!message.status || !message.data) {
			return undefined;
		}

		// Handle html content - it can be a string or array of strings
		let html = "";
		if (typeof message.data.html === "string") {
			html = message.data.html;
		} else if (Array.isArray(message.data.html)) {
			html = message.data.html.join("");
		}

		return html || undefined;
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

// Internal implementation functions below

/**
 * Register email using mailjs for staging environment.
 */
async function registerEmailStaging({
	label,
	password,
}: {
	label: string;
	password: string;
}): Promise<string> {
	const domains = await mailjs.getDomains();
	if (!domains.data.length) {
		throw new Error("No domains available");
	}
	const domain = domains.data[0].domain;
	const email = `${label}@${domain}`;
	const registerResponse = await mailjs.register(email, password);

	if (!registerResponse.status) {
		throw new Error(`Failed to register email: ${registerResponse.message}`);
	}

	console.log(`Successfully registered email: ${email}`);
	return email;
}

/**
 * Find last email using mailcatcher for testing environment.
 */
async function findLastEmailTesting({
	request,
	filter,
	inboxAddress,
	timeout = 5000,
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
					// Fetch HTML content for the email
					const htmlContent = await getEmailHtml({
						request,
						messageId: String(email.id),
					});
					return {
						...email,
						html: htmlContent || undefined,
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
 * Find last email using mailjs for staging environment.
 */
async function findLastEmailStaging({
	filter,
	request,
	inboxAddress,
	timeout = 5000,
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
						html: await getEmailHtml({
							request,
							messageId: String(lastEmail.id),
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
 * Internal function to get mailbox contents using mailjs for staging environment.
 */
async function getMailbox(
	email: string,
): Promise<{ address: string; messageCount: number; messages: Email[] }> {
	try {
		const password = env.MAILJS_PASSWORD;

		// Login to mailjs
		const loginResponse = await mailjs.login(email, password);
		if (!loginResponse.status) {
			throw new Error(`Failed to login to mailjs: ${loginResponse.message}`);
		}

		// Get messages
		const messagesResponse = await mailjs.getMessages();
		if (!messagesResponse.status || !messagesResponse.data) {
			return {
				address: email,
				messageCount: 0,
				messages: [],
			};
		}

		// Fetch message details in parallel
		const messages = await Promise.all(
			messagesResponse.data.map(async (message, index) => {
				try {
					const messageDetail = await mailjs.getMessage(message.id);

					if (!messageDetail.status || !messageDetail.data) {
						throw new Error(
							`Failed to fetch message details: ${messageDetail.message}`,
						);
					}

					// Extract data with safe fallbacks
					const subject = messageDetail.data.subject || "No Subject";
					let html = "";
					let to = "";

					// Handle html content
					if (typeof messageDetail.data.html === "string") {
						html = messageDetail.data.html;
					} else if (Array.isArray(messageDetail.data.html)) {
						html = messageDetail.data.html.join("");
					}

					// Handle to field
					if (typeof messageDetail.data.to === "string") {
						to = messageDetail.data.to;
					} else if (Array.isArray(messageDetail.data.to)) {
						to = messageDetail.data.to
							.map((recipient) =>
								typeof recipient === "string"
									? recipient
									: recipient.address || "",
							)
							.join(", ");
					} else if (
						messageDetail.data.to &&
						typeof messageDetail.data.to === "object"
					) {
						to = (messageDetail.data.to as { address: string }).address || "";
					}

					return {
						id: index + 1, // Use sequential index as ID
						recipients: [to],
						subject,
						html,
					};
				} catch (error) {
					console.warn(`Failed to fetch message ${message.id}:`, error);
					return {
						id: index + 1,
						recipients: [""],
						subject: "Error fetching message",
						html: "",
					};
				}
			}),
		);

		return {
			address: email,
			messageCount: messages.length,
			messages,
		};
	} catch (error) {
		console.error("Error getting mailbox:", error);
		throw error;
	}
}
