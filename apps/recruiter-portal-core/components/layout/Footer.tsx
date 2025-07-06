"use client";
import { COMPANY_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathname = usePathname();
	const isLanding = pathname === links.landing;
	return (
		<footer className="w-full flex items-center justify-center bg-background-600 py-4 border-t border-t-background-700">
			<div className="flex items-center gap-2 w-full max-w-7xl mx-auto px-4">
				<div className="flex w-full gap-6 justify-between items-center">
					<div className="w-full flex items-center gap-4">
						<p className="text-sm text-foreground-500">
							© {new Date().getFullYear()} {COMPANY_NAME}.
						</p>
					</div>
					<div className="w-full flex sm:items-center items-end flex-col sm:flex-row gap-4 justify-end">
						{isLanding && (
							<Link
								href="https://storyset.com/"
								color="foreground"
								size="sm"
								className="text-foreground-500 text-xs"
								isExternal
							>
								Illustrations by Storyset
							</Link>
						)}
						<div className="flex items-center gap-2">
							<Link
								href={links.terms}
								color="foreground"
								size="sm"
								className="text-foreground-500"
								isExternal
							>
								Terms
							</Link>
							<Link
								href={links.privacy}
								color="foreground"
								size="sm"
								className="text-foreground-500"
								isExternal
							>
								Privacy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
