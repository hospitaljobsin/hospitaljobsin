"use client";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { BotIcon, BrainCircuitIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import LandingHeader from "./LandingHeader";

export default function LandingView() {
	// Animated cycling words for the hero heading
	const words = ["Smarter", "Faster", "Easier"];
	const [index, setIndex] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % words.length);
		}, 5600);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col items-center">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-primary-700 via-primary-400 to-primary-600 text-primary-foreground pt-4 sm:pt-8 flex flex-col justify-center items-center w-full overflow-hidden">
				<LandingHeader />
				{/* Wavy Gradient Background Overlay */}
				<svg
					className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none select-none"
					viewBox="0 0 1440 320"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
				>
					<title>Wavy gradient background</title>
					<path
						fill="#fff"
						fillOpacity="0.2"
						d="M0,32L60,74.7C120,117,240,203,360,208C480,213,600,139,720,122.7C840,107,960,149,1080,181.3C1200,213,1320,235,1380,245.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
					/>
				</svg>

				<div className="max-w-7xl mx-auto pt-16 sm:pt-24 flex flex-col md:flex-row items-center gap-12 sm:gap-16 relative z-10">
					<div className="flex-1 md:flex items-end justify-end w-auto h-[600px] hidden">
						<img
							src="/images/hero-image.png"
							alt="Group of doctors smiling, representing healthcare professionals"
							className="w-auto h-full max-w-full object-cover object-bottom"
							loading="eager"
						/>
					</div>
					<div className="flex-1 flex flex-col items-start gap-6 z-10">
						<h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-primary-foreground drop-shadow-lg flex flex-row gap-2 items-center min-h-[1em]">
							<span>Hire</span>
							<motion.span
								key={words[index]}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5, type: "spring" }}
								className="ml-2 text-primary-foreground"
							>
								{words[index]}.
							</motion.span>
						</h1>
						<p className="text-lg sm:text-2xl text-primary-foreground/90 font-medium max-w-xl mx-auto md:mx-0">
							Say hello to an intelligent, intuitive, and tailor-made healthcare
							hiring experience.
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
			<section
				id="features"
				className="w-full bg-white dark:bg-background-300 pt-16 sm:pt-24 border-b border-background-200"
			>
				<div className="w-full mx-auto flex flex-col gap-12 ">
					{/* Deep AI Integration Section */}
					<motion.section
						className="w-full py-20 bg-background-50 dark:bg-background-900 rounded-3xl border border-background-200 overflow-hidden"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut" }}
					>
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-6 z-10">
								<h2 className="text-4xl sm:text-5xl font-extrabold text-primary-700 dark:text-primary-300 mb-2 drop-shadow-lg">
									AI-Powered Hiring, Built for Healthcare
								</h2>
								<h3 className="text-xl sm:text-2xl font-medium text-primary-800 dark:text-primary-200 mb-4 opacity-90">
									Make better hiring decisions with real intelligence
								</h3>
								<p className="text-lg text-foreground-700 dark:text-foreground-200 max-w-xl mb-6">
									Experience the future of healthcare recruitment with advanced
									AI features designed to empower your hiring process.
								</p>
								<ul className="space-y-6">
									<li className="flex items-center gap-4">
										<span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full shadow-md">
											<BrainCircuitIcon className="w-7 h-7 text-primary-600 dark:text-primary-300" />
										</span>
										<span className="text-lg font-semibold">
											AI Applicant Analysis
										</span>
										<img
											src="/screenshots/applicant-ai-analysis.png"
											alt="Screenshot of AI Applicant Analysis feature"
											className="w-40 rounded-xl shadow-md border border-background-200 ml-4"
										/>
									</li>
									<li className="flex items-center gap-4">
										<span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full shadow-md">
											<SearchIcon className="w-7 h-7 text-primary-600 dark:text-primary-300" />
										</span>
										<span className="text-lg font-semibold">
											Natural Language Search
										</span>
										<img
											src="/screenshots/natural-language-search.png"
											alt="Screenshot of Natural Language Search feature"
											className="w-40 rounded-xl shadow-md border border-background-200 ml-4"
										/>
									</li>
									<li className="flex items-center gap-4">
										<span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full shadow-md">
											<BotIcon className="w-7 h-7 text-primary-600 dark:text-primary-300" />
										</span>
										<span className="text-lg font-semibold">AI Assistant</span>
										<img
											src="/screenshots/ai-chat-assistant.png"
											alt="Screenshot of AI Assistant feature"
											className="w-40 rounded-xl shadow-md border border-background-200 ml-4"
										/>
									</li>
								</ul>
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
