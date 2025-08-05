"use client";
import { COMPANY_NAME, WHATSAPP_CHANNEL_LINK } from "@/lib/constants";
import links from "@/lib/links";
import { Button, Link } from "@heroui/react";
import { useState } from "react";
import CookieSettingsModal from "../CookieSettingsModal";
import { WhatsappIcon } from "../icons";

export default function Footer() {
	const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

	return (
		<>
			<footer className="w-full flex items-center justify-center bg-background-600 py-4 border-t border-t-background-700">
				<div className="flex items-center gap-2 w-full max-w-7xl mx-auto px-4">
					<div className="flex w-full gap-6 justify-between items-center">
						<div className="w-full flex items-center gap-4">
							<p className="text-xs text-foreground-500 sm:text-nowrap">
								© {new Date().getFullYear()} {COMPANY_NAME}.
							</p>
							<div className="w-full flex items-center gap-4">
								<Link
									href={WHATSAPP_CHANNEL_LINK}
									target="_blank"
									className="flex flex-col sm:flex-row sm:items-center items-start gap-2 text-xs text-foreground-500"
								>
									<WhatsappIcon
										className="w-4 h-4 text-foreground-500"
										size={10}
									/>{" "}
									<span className="hidden sm:block">Follow for job alerts</span>
								</Link>
							</div>
						</div>

						<div className="w-full flex items-center gap-4 justify-end">
							<Button
								variant="light"
								size="sm"
								className="text-foreground-500 text-xs p-0 min-w-0 h-auto"
								onPress={() => setIsCookieModalOpen(true)}
							>
								<span className="hidden sm:inline">Manage your cookies</span>
								<span className="sm:hidden">Cookies</span>
							</Button>
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

			<CookieSettingsModal
				isOpen={isCookieModalOpen}
				onClose={() => setIsCookieModalOpen(false)}
			/>
		</>
	);
}
