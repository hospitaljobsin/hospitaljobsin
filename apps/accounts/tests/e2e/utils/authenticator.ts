import { authenticator } from "otplib";

/**
 * Calculates the number of seconds remaining until the current OTP expires.
 * This version takes into account a custom epoch (if set in authenticator.options).
 * @param period The TOTP period in seconds (default: 30)
 * @returns Number of seconds until expiration
 */
export function getOTPRemainingSeconds(period = 30): number {
	// Use a custom epoch if provided in authenticator.options, otherwise default to 0.
	const epoch = authenticator.options.epoch || 0;
	const now = Math.floor(Date.now() / 1000);
	return period - ((now - epoch) % period);
}

/**
 * Waits for the specified number of milliseconds
 * @param ms Milliseconds to wait
 */
const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a valid OTP. If the OTP is about to expire (≤5 seconds remaining), it waits
 * until the current OTP expires and then generates a new one.
 *
 * @param totp_secret The OTP secret key.
 * @param period The OTP period (default: 30 seconds).
 * @returns A valid OTP.
 */
export async function generateValidOTP({
	totp_secret,
	period = 30,
}: {
	totp_secret: string;
	period?: number;
}): Promise<string> {
	// Generate OTP with the specified period.
	const otp = authenticator.generate(totp_secret);
	const remainingSeconds = getOTPRemainingSeconds(period);

	// If OTP is valid but about to expire (≤ 5 seconds remaining)
	if (authenticator.check(otp, totp_secret) && remainingSeconds <= 5) {
		console.log(
			`OTP about to expire in ${remainingSeconds}s. Waiting for new OTP...`,
		);
		// Wait until current OTP expires and a bit more to ensure we're in the next window.
		await delay((remainingSeconds + 1) * 1000);
		return authenticator.generate(totp_secret);
	}

	// Return the current OTP if it's valid and not about to expire.
	if (authenticator.check(otp, totp_secret)) {
		return otp;
	}

	throw new Error("Failed to generate valid OTP");
}
