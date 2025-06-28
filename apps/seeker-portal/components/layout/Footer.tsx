"use client";
import { COMPANY_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Link } from "@heroui/react";

export default function Footer() {
	return (
		<footer className="w-full flex items-center justify-center bg-background-600 py-4 border-t border-t-background-700">
			<div className="flex items-center gap-2 w-full max-w-7xl mx-auto px-4">
				<div className="flex w-full gap-6 justify-between items-center">
					<div className="w-full flex items-center gap-4">
						<p className="text-xs text-foreground-500">
							© {new Date().getFullYear()} {COMPANY_NAME}.
						</p>
					</div>
					<div className="w-full flex items-center gap-4 justify-end">
						<Link
							href={links.terms}
							color="foreground"
							size="sm"
							className="text-foreground-500 text-xs"
							isExternal
						>
							Terms
						</Link>
						<Link
							href={links.privacy}
							color="foreground"
							size="sm"
							className="text-foreground-500 text-xs"
							isExternal
						>
							Privacy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
