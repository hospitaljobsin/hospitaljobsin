import { env } from "@/lib/env";
import type { APIRequestContext } from "@playwright/test";

export type Email = {
	id: number;
	recipients: string[];
	subject: string;
};

async function findEmail({
	request,
	filter,
}: {
	request: APIRequestContext;
	filter?: (email: Email) => boolean;
}): Promise<Email | null> {
	const response = await request.get(`${env.MAILCATCHER_BASE_URL}/messages`);

	let emails: Email[] = await response.json();

	if (filter) {
		emails = emails.filter(filter);
	}

	const email = emails[emails.length - 1];

	if (email) {
		return email;
	}

	return null;
}

export function findLastEmail({
	request,
	filter,
	timeout = 5000,
}: {
	request: APIRequestContext;
	filter?: (email: Email) => boolean;
	timeout?: number;
}): Promise<Email | null> {
	const timeoutPromise = new Promise<Email | null>((resolve, _reject) =>
		setTimeout(() => resolve(null), timeout),
	);

	const checkEmails = async () => {
		while (true) {
			const emailData = await findEmail({ request, filter });

			if (emailData) {
				return emailData;
			}
			// Wait for 100ms before checking again
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	};

	return Promise.race([timeoutPromise, checkEmails()]);
}
