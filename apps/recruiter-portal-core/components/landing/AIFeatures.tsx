"use client";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { BotIcon, BrainCircuitIcon, SearchIcon } from "lucide-react";

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

export default function AIFeatures() {
	return (
		<section className="w-full py-10 bg-background-50 dark:bg-background-900 rounded-2xl overflow-hidden px-4">
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
						viewport={{ once: true, amount: 0.1 }}
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
										Find the right candidates using intuitive, conversational
										search—no complex filters needed.
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
										Get real-time support and answers regarding candidates,
										powered by advanced AI.
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
	);
}
