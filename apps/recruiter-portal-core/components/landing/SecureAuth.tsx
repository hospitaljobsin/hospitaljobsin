import { motion } from "framer-motion";

export default function SecureAuth() {
	return (
		<motion.section
			className="w-full py-20 bg-primary-50 rounded-2xl px-4"
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
		>
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
				<div className="flex-1 flex flex-col items-start gap-6 px-4">
					<h2 className="text-3xl sm:text-4xl font-medium text-primary-700 tracking-tight">
						Security First. Peace of Mind Always.
					</h2>
					<h3 className="text-lg sm:text-xl text-foreground-700 dark:text-foreground-200 text-center">
						Data you can trust. Accounts you can control.
					</h3>
					<ul className="text-lg text-foreground-700 dark:text-foreground-200 space-y-3 list-disc list-inside">
						<li>
							Two-factor authentication (2FA) and modern passkey support keep
							your accounts protected with the latest security standards
						</li>
						<li>Track your devices to block unauthorized access</li>
					</ul>
				</div>
				<div className="flex-1 flex justify-center md:justify-end px-4">
					<img
						src="/screenshots/accounts-center.png"
						alt="AI Chat Assistant"
						className="rounded-2xl w-full max-w-4xl object-cover"
					/>
				</div>
			</div>
		</motion.section>
	);
}
