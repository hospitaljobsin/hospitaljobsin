"use client";
import links from "@/lib/links";
import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { BotIcon, BrainCircuitIcon, SearchIcon } from "lucide-react";
import LandingHeader from "./LandingHeader";

export default function LandingView() {
	return (
		<div className="flex flex-col items-center">
			<LandingHeader />
			{/* Hero Section */}
			<div className="w-full bg-primary-400 text-primary-foreground pt-4 sm:pt-8">
				<div className="max-w-7xl mx-auto py-16 sm:py-24 flex flex-col md:flex-row items-center gap-8">
					<div className="flex-1 flex flex-col items-start gap-6">
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
							Hire Smarter. Faster. Easier.
						</h1>
						<p className="text-lg opacity-90">
							Say goodbye to traditional job boards and say to an intelligent,
							intuitive, and tailor-made healthcare hiring experience.
						</p>
						<div className="flex flex-row gap-4 flex-wrap">
							<Button
								variant="solid"
								color="default"
								size="lg"
								as={"a"}
								href={links.createOrganization}
								className="font-medium"
							>
								Get Started
							</Button>
							<Button
								variant="flat"
								color="default"
								size="lg"
								as={"a"}
								href="#features"
								className="font-medium"
							>
								Learn More
							</Button>
						</div>
					</div>
					<div className="flex-1 relative sm:h-[420px] h-[320px]  w-full rounded-4xl overflow-visible bg-primary-300">
						<div className="absolute inset-0 bg-opacity-30 bg-primary-200 rounded-4xl">
							{/* Container acts as a positioning reference */}
							<div className="absolute inset-x-0 bottom-0 h-[100%] overflow-visible">
								{/* Image container - sized and positioned to "pop out" */}
								<div className="absolute left-[-7.5%] right-[-7.5%] bottom-0 top-[-25%] overflow-hidden">
									<img
										src="/images/hero-image.png"
										alt="Hero"
										loading="eager"
										className="object-cover object-top"
										fetchPriority="high"
										style={{
											filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))",
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Credential Validation Feature Section */}
			<section className="w-full bg-transparent py-16 sm:py-24 flex justify-center border-b border-background-200">
				<motion.div
					className="max-w-5xl w-full mx-auto"
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
				>
					<div className="flex flex-col items-center gap-8 text-center bg-white dark:bg-background-800 rounded-3xl border border-background-200 py-12 px-6 sm:px-12">
						<div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-2">
							<svg
								width="40"
								height="40"
								fill="none"
								viewBox="0 0 40 40"
								aria-hidden="true"
							>
								<circle
									cx="20"
									cy="20"
									r="18"
									stroke="#00a925"
									strokeWidth="3"
									fill="#e6f5e9"
								/>
								<path
									d="M14 21l4 4 8-8"
									stroke="#00a925"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold text-green-900 dark:text-green-200 mb-2">
							Verified Medical Professionals
						</h2>
						<p className="text-lg text-green-800 dark:text-green-100 max-w-2xl mx-auto opacity-90">
							We validate credentials of medical professionals, allowing HR to
							smoothly shortlist candidates from a pool of verified candidates.
						</p>
					</div>
				</motion.div>
			</section>

			{/* Features Section */}
			<section className="w-full bg-primary-100 dark:bg-background-300 py-16 sm:pt-24 border-b border-background-200">
				<div className="w-full mx-auto flex flex-col gap-12 ">
					<h2 className="text-4xl sm:text-5xl font-extrabold text-center text-primary-700 dark:text-primary-300 mb-4 tracking-tight">
						Revolutionize Healthcare Recruitment with AI
					</h2>
					<p className="text-lg text-center text-primary-600 dark:text-primary-200 max-w-2xl mx-auto opacity-90">
						Find, attract, and hire the best doctors, nurses, and allied health
						professionals with next-gen healthcare AI tools, beautiful
						workflows, and instant clinical insights.
					</p>
				</div>
			</section>
			<section
				id="features"
				className="w-full bg-white dark:bg-background-300 pt-16 sm:pt-24 border-b border-background-200"
			>
				<div className="w-full mx-auto flex flex-col gap-12 ">
					{/* Deep AI Integration Section */}
					<motion.section
						className="w-full py-20 bg-background-50 dark:bg-background-900 rounded-3xl border border-background-200"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut" }}
					>
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									AI-Powered Hiring, Built for Healthcare
								</h2>
								<h3>Make better hiring decisions with real intelligence</h3>
								<div className="w-full flex flex-col md:flex-row gap-6 mt-4">
									{/* AI Applicant Analysis Card */}
									<Card className="flex-1 min-w-[220px]" shadow="sm">
										<CardBody className="flex flex-col items-start gap-3 p-6">
											<BrainCircuitIcon />
											<h3 className="text-xl font-semibold">
												AI Applicant Analysis
											</h3>
											<p className="text-base text-foreground-600 dark:text-foreground-200">
												Get detailed insights, match ratings, and summary
												reports for every candidate.
											</p>
										</CardBody>
									</Card>
									{/* Natural Language Search Card */}
									<Card className="flex-1 min-w-[220px]" shadow="sm">
										<CardBody className="flex flex-col items-start gap-3 p-6">
											<SearchIcon />
											<h3 className="text-xl font-semibold">
												Natural Language Search
											</h3>
											<p className="text-base text-foreground-600 dark:text-foreground-200">
												Skip the filters. Just type "nurses with ICU experience
												near Chennai" and get instant, accurate results.
											</p>
										</CardBody>
									</Card>
									{/* AI Assistant Card */}
									<Card className="flex-1 min-w-[220px]" shadow="sm">
										<CardBody className="flex flex-col items-start gap-3 p-6">
											<BotIcon />
											<h3 className="text-xl font-semibold">AI Assistant</h3>
											<p className="text-base text-foreground-600 dark:text-foreground-200">
												Your personal recruitment co-pilot to guide you through
												every applicant's profile and status.
											</p>
										</CardBody>
									</Card>
								</div>
							</div>
							<div className="flex-1 flex justify-center md:justify-end">
								<img
									src="/images/hero-ai-hiring.jpg"
									alt="AI Dashboard"
									className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
								/>
							</div>
						</div>
					</motion.section>

					{/* AI-Powered Insights Section */}
					<motion.section
						className="w-full py-20 bg-primary-50 dark:bg-primary-900 rounded-3xl border border-background-200"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
					>
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									Built Specifically for Healthcare
								</h2>
								<h3>Because your needs are different</h3>
								<ul className="text-lg text-foreground-700 dark:text-foreground-200 space-y-3 list-disc list-inside">
									<li>
										Post Full-time, Part-time, and Locum positions with ease.
									</li>
									<li>
										Search and sort candidates by location, distance, or
										specialty.
									</li>
									<li>
										Tailored tools to manage multiple departments or branches
										under one account.
									</li>
								</ul>
							</div>
							<div className="flex-1 flex justify-center md:justify-end">
								<img
									src="/images/hero-insights.jpg"
									alt="AI Insights"
									className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
								/>
							</div>
						</div>
					</motion.section>

					{/* Natural Language Search Section */}
					<motion.section
						className="w-full py-20 bg-background-100 dark:bg-background-800 rounded-3xl border border-background-200"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
					>
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									Your Own Branded Subdomain
								</h2>
								<h3>A professional home for your organization</h3>
								<ul className="text-lg text-foreground-700 dark:text-foreground-200 space-y-3 list-disc list-inside">
									<li>
										Every organization gets its own unique domain: ✅ example:
										yourhospital.hospitaljobs.in
									</li>
									<li>Customize your organization's profile.</li>
									<li>Invite unlimited team members.</li>
									<li>
										Control access: promote admins, invite recruiters, and
										manage permissions with ease
									</li>
								</ul>
							</div>
							<div className="flex-1 flex justify-center md:justify-start">
								<img
									src="/images/hero-candidate-search.jpg"
									alt="AI Search"
									className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
								/>
							</div>
						</div>
					</motion.section>

					{/* AI Chat Assistant Section */}
					<motion.section
						className="w-full py-20 bg-primary-100 dark:bg-primary-800 rounded-3xl border border-background-200"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
					>
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									Security First. Peace of Mind Always.
								</h2>
								<h3>Data you can trust. Accounts you can control.</h3>
								<ul className="text-lg text-foreground-700 dark:text-foreground-200 space-y-3 list-disc list-inside">
									<li>
										Two-factor authentication (2FA) and modern passkey support
										keep your accounts protected with the latest security
										standards
									</li>
									<li>
										Secure authentication options including Google login for
										seamless and trusted access to your platform
									</li>
								</ul>
							</div>
							<div className="flex-1 flex justify-center md:justify-end">
								<img
									src="/images/hero-collaboration.jpg"
									alt="AI Chat Assistant"
									className="rounded-2xl shadow-2xl w-full max-w-md object-cover"
								/>
							</div>
						</div>
					</motion.section>
				</div>
			</section>

			{/* New: Healthcare Network Feature Section */}
			<section className="w-full bg-white py-16 sm:py-24 flex justify-center">
				<div className="max-w-5xl w-full mx-auto flex flex-col items-center gap-8 text-center">
					<div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-background-600 mb-2">
						<svg
							width="40"
							height="40"
							fill="none"
							viewBox="0 0 40 40"
							aria-hidden="true"
						>
							<circle
								cx="20"
								cy="20"
								r="18"
								stroke="#00a925"
								strokeWidth="3"
								fill="#e6f5e9"
							/>
							<path
								d="M20 12v8m0 0v8m0-8h8m-8 0h-8"
								stroke="#00a925"
								strokeWidth="2.5"
								strokeLinecap="round"
							/>
						</svg>
					</div>
					<h2 className="text-3xl sm:text-4xl font-bold text-primary-800 dark:text-primary-200 mb-2">
						Access a fresh and growing network of healthcare professionals
					</h2>
					<p className="text-lg text-primary-700 dark:text-primary-100 max-w-2xl mx-auto opacity-90">
						We're building a tightly knit network of healthcare professionals
						from the ground up
					</p>
				</div>
			</section>

			<section className="w-full bg-background-400 rounded-xl sm:p-12">
				<div className="mx-auto max-w-7xl flex items-start justify-between gap-8">
					<div className="w-52 h-52 hidden sm:block">
						<img
							src="/images/getting-started-image.png"
							alt="Get Started"
							loading="eager"
							className="object-cover scale-200 object-bottom"
							fetchPriority="high"
						/>
					</div>
					<div className="flex flex-col items-end gap-8 max-w-xl">
						<div className="flex flex-col items-end text-right w-full gap-4">
							<h2 className="text-2xl sm:text-3xl font-semibold">
								Ready to transform your healthcare recruitment?
							</h2>
							<p className="text-foreground-600">
								Join innovative hospitals using our platform to find and recruit
								top medical talent more efficiently.
							</p>
						</div>
						<Button
							variant="solid"
							color="primary"
							size="lg"
							as={"a"}
							href={links.createOrganization}
							className="font-medium"
						>
							Get Started Now
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
