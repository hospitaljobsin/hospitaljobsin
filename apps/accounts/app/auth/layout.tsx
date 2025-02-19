"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full flex h-screen items-center justify-center bg-white sm:bg-foreground-100">
			<div className="mx-auto w-full flex-1 sm:px-6">
				<div className="w-full max-w-md mx-auto">
					{children}{" "}
					<div className="text-center text-balance mt-6 text-xs w-full text-foreground-400 px-4">
						This site is protected by reCAPTCHA and the Google{" "}
						<a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
						<a href="https://policies.google.com/terms">Terms of Service</a>{" "}
						apply.
					</div>
				</div>
			</div>
			<div className="h-full bg-primary-100 flex-1 hidden lg:block" />
		</div>
	);
}
