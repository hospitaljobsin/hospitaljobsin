"use client";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";

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

export default function BuiltForHealthcare() {
	return (
		<motion.section
			className="w-full py-28 bg-primary-50 dark:bg-primary-900 rounded-2xl px-4"
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
						className="w-full flex flex-col md:flex-row gap-12 items-center justify-center"
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
	);
}
