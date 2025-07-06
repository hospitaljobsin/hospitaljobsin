"use client";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { Button, Input } from "@heroui/react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { BotIcon, BrainCircuitIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import LandingHeader from "./LandingHeader";

// Animation variants for staggered list
const listVariants: Variants = {
	visible: {
		transition: {
			staggerChildren: 0.25,
		},
	},
	hidden: {},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 40 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: [0.23, 1, 0.32, 1], // easeOut cubic-bezier
			delay: i * 0.08,
		},
	}),
};

export default function LandingView() {
	// Animated cycling words for the hero heading
	const words = ["Smarter", "Faster", "Easier"];
	const [index, setIndex] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % words.length);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col items-center w-full">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-primary-700 via-primary-400 to-primary-600 text-primary-foreground flex flex-col justify-center items-center w-full overflow-hidden">
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
					<div className="flex-1 flex flex-col items-start gap-6 z-10 pb-12 px-4">
						<h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-primary-foreground flex flex-row gap-2 items-center min-h-[1em]">
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

			{/* Features Section */}
			<section
				id="features"
				className="w-full bg-white dark:bg-background-300 pt-16 sm:pt-24 border-b border-background-200 px-4"
			>
				<div className="w-full mx-auto flex flex-col gap-12 ">
					{/* Deep AI Integration Section */}
					<section className="w-full py-10 bg-background-50 dark:bg-background-900 rounded-2xl overflow-hidden">
						<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-12 z-10">
								<motion.div
									className="w-full flex flex-col gap-4"
									initial={{ opacity: 0, y: 40 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.4 }}
									transition={{ duration: 0.7, ease: "easeOut" }}
								>
									<h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-primary-700  mb-2 text-center w-full">
										AI-Powered Hiring, Built for Healthcare
									</h2>
									<h3 className="text-xl sm:text-2xl text-foreground-600 mb-4 opacity-90 text-center w-full">
										Make better hiring decisions with real intelligence
									</h3>
								</motion.div>
								<motion.ul
									className="space-y-24"
									variants={listVariants}
									initial="hidden"
									whileInView="visible"
									viewport={{ once: true, amount: 0.4 }}
								>
									{[
										// 1st feature
										<motion.li
											key="ai-applicant-analysis"
											variants={itemVariants}
											custom={0}
											viewport={{ once: true, amount: 0.4 }}
											className="flex lg:items-center flex-col lg:flex-row gap-8"
										>
											<div className="flex flex-col gap-4">
												<div className="flex items-center gap-2">
													<span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full shadow-md">
														<BrainCircuitIcon className="w-7 h-7 text-primary-600 " />
													</span>
													<span className="text-lg sm:text-2xl font-medium text-primary-700">
														AI Applicant Analysis
													</span>
												</div>
												<span className="block text-base sm:text-lg text-foreground-600 max-w-md">
													Instantly evaluate candidates with AI-driven insights
													tailored for healthcare roles.
												</span>
											</div>
											<img
												src="/screenshots/applicant-ai-analysis.png"
												alt="Screenshot of AI Applicant Analysis feature"
												className="w-full max-w-4xl object-contain rounded-xl shadow-md border border-background-200 mx-0 sm:mx-4"
											/>
										</motion.li>,
										// 2nd feature
										<motion.li
											key="natural-language-search"
											variants={itemVariants}
											custom={1}
											viewport={{ once: true, amount: 0.4 }}
											className="flex lg:items-center flex-col-reverse lg:flex-row gap-8"
										>
											<img
												src="/screenshots/natural-language-search.png"
												alt="Screenshot of Natural Language Search feature"
												className="w-full max-w-4xl object-contain rounded-xl shadow-md border border-background-200 mx-0 sm:mx-4"
											/>
											<div className="flex flex-col gap-4">
												<div className="flex items-center gap-2">
													<span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full shadow-md">
														<SearchIcon className="w-7 h-7 text-primary-600 " />
													</span>
													<span className="text-lg sm:text-2xl font-medium text-primary-700">
														Natural Language Search
													</span>
												</div>
												<span className="block text-base sm:text-lg text-foreground-600 max-w-md">
													Find the right candidates using intuitive,
													conversational search—no complex filters needed.
												</span>
											</div>
										</motion.li>,
										// 3rd feature
										<motion.li
											key="integrated-ai-assistant"
											variants={itemVariants}
											custom={2}
											viewport={{ once: true, amount: 0.4 }}
											className="flex lg:items-center flex-col lg:flex-row gap-8"
										>
											<div className="flex flex-col gap-4">
												<div className="flex items-center gap-2">
													<span className="bg-primary-100 dark:bg-primary-800 p-2 rounded-full shadow-md">
														<BotIcon className="w-7 h-7 text-primary-600 " />
													</span>
													<span className="text-lg sm:text-2xl font-medium text-primary-700">
														Integrated AI Assistant
													</span>
												</div>
												<span className="block text-base sm:text-lg text-foreground-600 max-w-md">
													Get real-time support and answers regarding
													candidates, powered by advanced AI.
												</span>
											</div>
											<img
												src="/screenshots/ai-chat-assistant.png"
												alt="Screenshot of AI Assistant feature"
												className="w-full max-w-4xl object-contain rounded-xl shadow-md border border-background-200 mx-0 sm:mx-4"
											/>
										</motion.li>,
									].map((li, i) => li)}
								</motion.ul>
							</div>
						</div>
					</section>

					{/* AI-Powered Insights Section */}
					<motion.section
						className="w-full py-28 bg-primary-50 dark:bg-primary-900 rounded-2xl"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
					>
						<div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
							<div className="flex-1 flex flex-col items-start gap-12">
								<div className="flex flex-col items-center gap-4 w-full">
									<h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-primary-700 w-full text-center">
										Built Specifically for Healthcare
									</h2>
									<h3 className="text-lg sm:text-xl text-foreground-700 dark:text-foreground-200 w-full text-center">
										Because your needs are different
									</h3>
								</div>

								<motion.div
									className="w-full flex flex-col md:flex-row gap-12 md:items-center"
									initial="hidden"
									whileInView="visible"
									viewport={{ once: true, amount: 0.4 }}
									variants={listVariants}
								>
									{[
										{
											img: "/images/credentials.svg",
											alt: "Specialty-Based Candidate Matching",
											title: "Built in Medical Credential Verification",
											text: null,
										},
										{
											img: "/images/job-type-time.svg",
											alt: "Specialty-Based Candidate Matching",
											title:
												"First Class Support for Locum, Full-time, and Part-time Positions",
											text: null,
										},
										{
											img: "/images/doctors.svg",
											alt: "Specialty-Based Candidate Matching",
											title: "Specialty-Based Candidate Matching",
											text: null,
										},
									].map((feature, i) => (
										<motion.div
											key={feature.title}
											className="p-6 flex w-full gap-4 flex-col items-center jusiify-center max-w-md group rounded-2xl hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
											variants={itemVariants}
											custom={i}
											tabIndex={0}
											aria-label={feature.title}
										>
											<div className="relative h-48 w-48 aspect-auto">
												<Image
													src={feature.img}
													alt={feature.alt}
													fill
													className="object-cover group-hover:scale-110 transition-transform duration-200"
												/>
											</div>
											<span className="font-medium text-lg text-center max-w-md mx-auto">
												{feature.title}
											</span>
										</motion.div>
									))}
								</motion.div>
							</div>
						</div>
					</motion.section>

					{/* Branded Subdomain Section */}
					<motion.section
						className="w-full py-20 bg-gradient-to-br from-background-100 via-white to-background-200 dark:from-background-800 dark:via-background-900 dark:to-background-700 rounded-2xl relative overflow-hidden"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
					>
						<div className="max-w-7xl mx-auto flex flex-col items-center gap-10 relative z-10 px-2 sm:px-6">
							<div className="flex flex-col items-center gap-2 w-full">
								<h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-primary-700 text-center relative inline-block">
									<span className="relative z-10">
										Your Own Branded Subdomain
									</span>
								</h2>
								<h3 className="text-lg sm:text-xl text-foreground-700 dark:text-foreground-200 text-center">
									A professional home for your organization
								</h3>
							</div>
							{/* Unique Subdomain */}
							<motion.div
								className="w-full group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
								variants={itemVariants}
								custom={0}
								tabIndex={0}
								aria-label="Unique Subdomain feature"
							>
								<div className="flex-shrink-0 mb-2 w-full">
									<Input
										placeholder={`yourdomain.${env.NEXT_PUBLIC_ROOT_DOMAIN}`}
										size="lg"
										fullWidth
										startContent={
											<SearchIcon
												size={24}
												className="text-foreground-500 mr-2"
											/>
										}
										classNames={{
											inputWrapper: "p-4 md:p-12 min-h-24",
											input: "text-xl",
										}}
										isReadOnly
									/>
								</div>
								<div className="text-foreground-600 text-base text-center max-w-xl">
									Instantly claim a memorable web address for your hospital or
									clinic—
									<span className="font-medium">
										yourdomain.{env.NEXT_PUBLIC_ROOT_DOMAIN}
									</span>
								</div>
							</motion.div>
							<motion.div
								className="flex flex-col sm:flex-row gap-8 w-full mt-4 justify-center flex-1"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.4 }}
								variants={listVariants}
							>
								{/* Customizable Profile */}
								<motion.div
									className="max-w-md group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
									variants={itemVariants}
									custom={1}
									tabIndex={0}
									aria-label="Customizable Profile feature"
								>
									<div className="flex-shrink-0 mb-2 relative w-48 h-48">
										<Image
											src="/images/online-profile.svg"
											alt="Customizable Profile"
											fill
											className="object-cover  group-hover:scale-110 transition-transform duration-200"
										/>
									</div>
									<div className="font-medium text-primary-700 text-xl text-center">
										Customizable Profile
									</div>
									<div className="text-foreground-600 text-base text-center">
										Showcase your unique culture, values, and benefits with a
										beautiful, fully customizable organization profile.
									</div>
								</motion.div>
								{/* Unlimited Team Members */}
								<motion.div
									className="max-w-md group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
									variants={itemVariants}
									custom={2}
									tabIndex={0}
									aria-label="Unlimited Team Members feature"
								>
									<div className="flex-shrink-0 mb-2 relative w-48 h-48">
										<Image
											src="/images/team.svg"
											alt="Customizable Profile"
											fill
											className="object-cover  group-hover:scale-110 transition-transform duration-200"
										/>
									</div>
									<div className="font-medium text-primary-700 text-xl text-center">
										Unlimited Team Members
									</div>
									<div className="text-foreground-600 text-base text-center">
										Collaborate effortlessly—invite your entire hiring team,
										from HR to department heads, with no limits.
									</div>
								</motion.div>
								{/* Access Control */}
								<motion.div
									className="max-w-md group flex flex-col items-center gap-4 rounded-2xl p-8 hover:scale-[1.03] transition-all duration-200 ease-out cursor-pointer"
									variants={itemVariants}
									custom={3}
									tabIndex={0}
									aria-label="Granular Access Control feature"
								>
									<div className="flex-shrink-0 mb-2 relative w-48 h-48">
										<Image
											src="/images/secure-access.svg"
											alt="Customizable Profile"
											fill
											className="object-cover group-hover:scale-110 transition-transform duration-200"
										/>
									</div>
									<div className="font-medium text-primary-700 text-xl text-center">
										Granular Access Control
									</div>
									<div className="text-foreground-600 text-base text-center">
										Assign roles, promote admins, and manage recruiter
										permissions with a click—security and flexibility for every
										team.
									</div>
								</motion.div>
							</motion.div>
						</div>
					</motion.section>

					{/* AI Chat Assistant Section */}
					<motion.section
						className="w-full py-20 bg-primary-50 rounded-2xl"
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
										Two-factor authentication (2FA) and modern passkey support
										keep your accounts protected with the latest security
										standards
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
					<h2 className="text-3xl sm:text-4xl font-medium text-primary-800 dark:text-primary-200 mb-2">
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
