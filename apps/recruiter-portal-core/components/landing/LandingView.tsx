"use client";
import AIFeatures from "./AIFeatures";
import BrandedSubdomain from "./BrandedSubdomain";
import BuiltForHealthcare from "./BuiltForHealthcare";
import CallToAction from "./CallToAction";
import HealthcareNetwork from "./HealthcareNetwork";
import Hero from "./Hero";
import SecureAuth from "./SecureAuth";

export default function LandingView() {
	return (
		<div className="flex flex-col items-center w-full">
			{/* Hero Section */}
			<Hero />

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
			<HealthcareNetwork />

			<CallToAction />
		</div>
	);
}
