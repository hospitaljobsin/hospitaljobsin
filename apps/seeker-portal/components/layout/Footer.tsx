"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Link } from "@heroui/react";
import Logo from "../Logo";

export default function Footer() {
	return (
		<footer className="w-full flex items-center justify-center bg-background-600 py-4 border-t border-t-background-700">
			<div className="flex items-center gap-2 w-full max-w-5xl mx-auto px-4">
				<div className="flex w-full gap-6 justify-between items-center">
					<div className="w-full flex items-center gap-4">
						<Link href={links.landing} className="font-medium text-inherit">
							<Logo className="text-foreground-500" size={18} />
						</Link>
						<p className="text-sm text-foreground-500">
							© {new Date().getFullYear()} {APP_NAME}.
						</p>
					</div>
					<div className="w-full flex items-center gap-4 justify-end">
						<Link
							href={links.terms}
							color="foreground"
							size="sm"
							className="text-foreground-500"
						>
							Terms
						</Link>
						<Link
							href={links.privacy}
							color="foreground"
							size="sm"
							className="text-foreground-500"
						>
							Privacy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
