"use client";
import links from "@/lib/links";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import AIFeatures from "./AIFeatures";
import BrandedSubdomain from "./BrandedSubdomain";
import BuiltForHealthcare from "./BuiltForHealthcare";
import LandingHeader from "./LandingHeader";
import SecureAuth from "./SecureAuth";

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
				className="w-full bg-background dark:bg-background-300 pt-16 sm:pt-24 border-b border-background-200"
			>
				<div className="w-full mx-auto flex flex-col gap-12">
					{/* Deep AI Integration Section */}
					<AIFeatures />

					{/* Built For Healthcare Section */}
					<BuiltForHealthcare />

					{/* Branded Subdomain Section */}
					<BrandedSubdomain />

					{/* Auth Section */}
					<SecureAuth />
				</div>
			</section>

			{/* New: Healthcare Network Feature Section */}
			<section className="w-full bg-background py-16 sm:py-24 flex justify-center px-4">
				<div className="max-w-5xl w-full mx-auto flex flex-col items-center gap-8 text-center">
					<div className="flex-shrink-0 mb-2 relative w-48 sm:w-96 h-48 sm:h-96">
						<Image
							src="/images/network-team.svg"
							alt="Access a fresh and growing network of healthcare professionals"
							fill
							className="object-cover group-hover:scale-110 transition-transform duration-200"
						/>
					</div>
					<h2 className="text-3xl sm:text-4xl font-medium text-primary-800 dark:text-primary-200 tracking-tight max-w-2xl">
						Access a fresh and growing network of healthcare professionals
					</h2>
					<h3 className="text-lg sm:text-xl text-primary-600 dark:text-foreground-200 w-full text-center max-w-2xl">
						We're building a tightly knit network of healthcare professionals
						from the ground up
					</h3>
				</div>
			</section>

			<section className="w-full bg-background-400 rounded-xl sm:p-12 px-4">
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
							<h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
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
