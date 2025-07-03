"use client";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import LandingHeader from "./LandingHeader";

export default function LandingView() {
	return (
		<div className="flex flex-col items-center">
			<LandingHeader />
			{/* Hero Section */}
			<div className="w-full bg-primary-400 text-primary-foreground pt-4 sm:pt-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-5 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-8">
					<div className="flex-1 flex flex-col items-start gap-6">
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
							Streamline Your Healthcare Recruitment
						</h1>
						<p className="text-lg opacity-90">
							Find the perfect healthcare professionals for your hospital with
							our powerful recruitment platform. Post jobs, manage applications,
							and hire exceptional talent all in one place.
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

			{/* Features Section */}
			<section className="w-full bg-primary-100 dark:bg-background-300 py-16 sm:pt-24 border-b border-background-200">
				<div className="w-full mx-auto px-4 sm:px-5 flex flex-col gap-12 ">
					<h2 className="text-3xl sm:text-4xl font-bold text-center text-primary-700 dark:text-primary-300 mb-4">
						Revolutionize Your Recruitment with AI
					</h2>
				</div>
			</section>
			<section
				id="features"
				className="w-full bg-white dark:bg-background-300 pt-16 sm:pt-24 border-b border-background-200"
			>
				<div className="w-full mx-auto px-4 sm:px-5 flex flex-col gap-12 ">
					{/* Deep AI Integration Section */}
					<motion.section
						className="w-full py-20 bg-background-50 dark:bg-background-900"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut" }}
					>
						<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
							{/* Custom Animated SVG */}
							<div className="flex-1 flex justify-center md:justify-start">
								<motion.svg
									width="320"
									height="220"
									viewBox="0 0 320 220"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="drop-shadow-xl"
									initial={{ rotate: -8, scale: 0.95 }}
									animate={{ rotate: [-8, 8, -8], scale: [0.95, 1.05, 0.95] }}
									transition={{
										duration: 6,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
								>
									<title>3D AI Dashboard Animation</title>
									<defs>
										<radialGradient id="ai1" cx="50%" cy="50%" r="50%">
											<stop offset="0%" stopColor="#00a925" stopOpacity="0.7" />
											<stop
												offset="100%"
												stopColor="#4db866"
												stopOpacity="0.2"
											/>
										</radialGradient>
									</defs>
									<ellipse cx="160" cy="200" rx="120" ry="18" fill="#9ad7a7" />
									<g filter="url(#blur1)">
										<circle cx="160" cy="110" r="60" fill="url(#ai1)" />
									</g>
									<rect
										x="90"
										y="60"
										width="140"
										height="60"
										rx="28"
										fill="#e6f5e9"
										fillOpacity="0.7"
									/>
									<rect
										x="120"
										y="80"
										width="80"
										height="20"
										rx="10"
										fill="#00a925"
										fillOpacity="0.8"
									/>
									<animateTransform
										attributeName="transform"
										type="skewY"
										values="-2;2;-2"
										dur="4s"
										repeatCount="indefinite"
									/>
								</motion.svg>
							</div>
							{/* Text */}
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									Deeply Integrated AI
								</h2>
								<p className="text-lg text-foreground-700 dark:text-foreground-200">
									Our dashboard is powered by advanced AI, automating repetitive
									tasks and surfacing the most important information—so you can
									focus on what matters: hiring the best talent.
								</p>
								<Button
									variant="solid"
									color="primary"
									size="lg"
									as={"a"}
									href={links.createOrganization}
									className="font-medium mt-2"
								>
									Try AI Dashboard
								</Button>
							</div>
						</div>
					</motion.section>

					{/* AI-Powered Insights Section */}
					<motion.section
						className="w-full py-20 bg-primary-50 dark:bg-primary-900"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
					>
						<div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
							{/* Custom Animated SVG */}
							<div className="flex-1 flex justify-center md:justify-end">
								<motion.svg
									width="320"
									height="220"
									viewBox="0 0 320 220"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="drop-shadow-xl"
									initial={{ scale: 0.92 }}
									animate={{ scale: [0.92, 1.08, 0.92] }}
									transition={{
										duration: 7,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
								>
									<title>3D AI Insights Animation</title>
									<defs>
										<linearGradient id="insight1" x1="0" y1="0" x2="1" y2="1">
											<stop offset="0%" stopColor="#00a925" stopOpacity="0.7" />
											<stop
												offset="100%"
												stopColor="#4db866"
												stopOpacity="0.2"
											/>
										</linearGradient>
									</defs>
									<ellipse cx="160" cy="200" rx="120" ry="18" fill="#9ad7a7" />
									<rect
										x="80"
										y="60"
										width="160"
										height="80"
										rx="32"
										fill="url(#insight1)"
									/>
									<circle
										cx="160"
										cy="100"
										r="36"
										fill="#e6f5e9"
										fillOpacity="0.7"
									/>
									<rect
										x="130"
										y="90"
										width="60"
										height="20"
										rx="8"
										fill="#00a925"
									/>
									<motion.circle
										cx="160"
										cy="100"
										r="12"
										fill="#4db866"
										animate={{ cy: [100, 120, 100] }}
										transition={{
											duration: 2.5,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
											ease: "easeInOut",
										}}
									/>
								</motion.svg>
							</div>
							{/* Text */}
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									AI-Powered Actionable Insights
								</h2>
								<p className="text-lg text-foreground-700 dark:text-foreground-200">
									Every applicant profile comes with instant, actionable AI
									insights—helping HR make confident, data-driven decisions in
									seconds, not hours.
								</p>
								<Button
									variant="solid"
									color="default"
									size="lg"
									as={"a"}
									href={links.createOrganization}
									className="font-medium mt-2"
								>
									See AI Insights
								</Button>
							</div>
						</div>
					</motion.section>

					{/* Natural Language Search Section */}
					<motion.section
						className="w-full py-20 bg-background-100 dark:bg-background-800"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
					>
						<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
							{/* Custom Animated SVG */}
							<div className="flex-1 flex justify-center md:justify-start">
								<motion.svg
									width="320"
									height="220"
									viewBox="0 0 320 220"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="drop-shadow-xl"
									initial={{ x: 0 }}
									animate={{ x: [0, 12, -12, 0] }}
									transition={{
										duration: 8,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
								>
									<title>3D Natural Language Search Animation</title>
									<defs>
										<radialGradient id="search1" cx="50%" cy="50%" r="50%">
											<stop offset="0%" stopColor="#00a925" stopOpacity="0.5" />
											<stop
												offset="100%"
												stopColor="#4db866"
												stopOpacity="0.1"
											/>
										</radialGradient>
									</defs>
									<ellipse cx="160" cy="200" rx="120" ry="18" fill="#9ad7a7" />
									<rect
										x="90"
										y="70"
										width="140"
										height="60"
										rx="24"
										fill="#e6f5e9"
										fillOpacity="0.7"
									/>
									<rect
										x="110"
										y="90"
										width="100"
										height="20"
										rx="8"
										fill="#00a925"
										fillOpacity="0.8"
									/>
									<circle cx="160" cy="110" r="40" fill="url(#search1)" />
									<motion.circle
										cx="160"
										cy="110"
										r="14"
										fill="#00a925"
										animate={{ r: [14, 22, 14] }}
										transition={{
											duration: 2.8,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
											ease: "easeInOut",
										}}
									/>
								</motion.svg>
							</div>
							{/* Text */}
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									AI Natural Language Search
								</h2>
								<p className="text-lg text-foreground-700 dark:text-foreground-200">
									No more endless filters. Just type what you need—our AI
									understands and finds the perfect candidates, instantly.
								</p>
								<Button
									variant="solid"
									color="primary"
									size="lg"
									as={"a"}
									href={links.createOrganization}
									className="font-medium mt-2"
								>
									Try AI Search
								</Button>
							</div>
						</div>
					</motion.section>

					{/* AI Chat Assistant Section */}
					<motion.section
						className="w-full py-20 bg-primary-100 dark:bg-primary-800"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
					>
						<div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
							{/* Custom Animated SVG */}
							<div className="flex-1 flex justify-center md:justify-end">
								<motion.svg
									width="320"
									height="220"
									viewBox="0 0 320 220"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="drop-shadow-xl"
									initial={{ scale: 1, rotate: 0 }}
									animate={{ scale: [1, 1.08, 1], rotate: [0, 6, -6, 0] }}
									transition={{
										duration: 7,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
								>
									<title>3D AI Chat Assistant Animation</title>
									<defs>
										<radialGradient id="chat1" cx="50%" cy="50%" r="50%">
											<stop offset="0%" stopColor="#00a925" stopOpacity="0.6" />
											<stop
												offset="100%"
												stopColor="#4db866"
												stopOpacity="0.1"
											/>
										</radialGradient>
									</defs>
									<ellipse cx="160" cy="200" rx="120" ry="18" fill="#9ad7a7" />
									<rect
										x="100"
										y="80"
										width="120"
										height="60"
										rx="20"
										fill="#e6f5e9"
										fillOpacity="0.7"
									/>
									<rect
										x="120"
										y="100"
										width="80"
										height="20"
										rx="8"
										fill="#00a925"
										fillOpacity="0.8"
									/>
									<circle cx="160" cy="110" r="36" fill="url(#chat1)" />
									<motion.circle
										cx="160"
										cy="110"
										r="12"
										fill="#00a925"
										animate={{ cy: [110, 130, 110] }}
										transition={{
											duration: 2.2,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
											ease: "easeInOut",
										}}
									/>
								</motion.svg>
							</div>
							{/* Text */}
							<div className="flex-1 flex flex-col items-start gap-6">
								<h2 className="text-3xl sm:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">
									AI Chat Assistant
								</h2>
								<p className="text-lg text-foreground-700 dark:text-foreground-200">
									Ask anything about your applicants—instantly. Your AI chat
									assistant delivers answers, insights, and summaries, right
									when you need them.
								</p>
								<Button
									variant="solid"
									color="default"
									size="lg"
									as={"a"}
									href={links.createOrganization}
									className="font-medium mt-2"
								>
									Chat with AI
								</Button>
							</div>
						</div>
					</motion.section>
				</div>
			</section>
			<section className="w-full bg-background-400 rounded-xl p-8 sm:p-12">
				<div className="mx-auto max-w-7xl flex items-start justify-between gap-8 px-4">
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
