import { APP_NAME } from "@/lib/constants";

export default function Footer() {
	return (
		<footer className="w-full flex items-center justify-center bg-background-600 py-4">
			<div className="flex items-center gap-2 w-full max-w-5xl mx-auto px-4">
				<p className="text-sm text-foreground-500">
					© {new Date().getFullYear()} {APP_NAME}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
