"use client";
import { Button, Card, CardBody } from "@heroui/react";
import { Briefcase, CheckCircle, FileText, Shield, Users } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import BenefitItem from "./BenefitItem";
import FeatureCard from "./FeatureCard";
import LandingHeader from "./LandingHeader";

export default function LandingView() {
	return (
		<div className="flex flex-col items-center">
			<LandingHeader />

			{/* Hero Section */}
			<div className="w-full bg-gradient-to-br from-primary-400 to-primary-600 text-primary-foreground pt-4 sm:pt-8">
				<div className="max-w-5xl mx-auto px-4 sm:px-5 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-8">
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
								href={links.dashboard}
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
					<div className="flex-1 relative h-[320px] sm:h-[420px] w-full rounded-4xl overflow-visible bg-primary-300">
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

			{/* Main Content */}
			<div className="py-8 sm:py-16 flex flex-col items-center gap-16 sm:gap-24 max-w-5xl px-4 sm:px-5 mx-auto w-full">
				{/* Features Section */}
				<section
					id="features"
					className="w-full flex flex-col items-center gap-12"
				>
					<div className="text-center max-w-3xl">
						<h2 className="text-3xl sm:text-4xl font-semibold mb-4">
							Powerful Recruitment Tools
						</h2>
						<p className="text-lg text-foreground-600">
							Everything you need to streamline your healthcare recruitment
							process and find the best candidates.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full -mt-4">
						<FeatureCard
							icon={<FileText className="w-10 h-10 text-primary" />}
							title="Job Management"
							description="Create and publish detailed job listings with specialized healthcare fields and requirements."
						/>
						<FeatureCard
							icon={<Users className="w-10 h-10 text-primary" />}
							title="Applicant Tracking"
							description="Review applications, track candidate status, and manage interviews all in one unified dashboard."
						/>
						<FeatureCard
							icon={<CheckCircle className="w-10 h-10 text-primary" />}
							title="Screening Tools"
							description="Custom screening questions and resume parsing to quickly identify qualified candidates."
						/>
					</div>
				</section>

				{/* Benefits Section */}
				<section className="w-full flex flex-col items-center gap-12">
					<div className="text-center max-w-3xl">
						<h2 className="text-3xl sm:text-4xl font-semibold mb-4">
							Why Choose {APP_NAME}?
						</h2>
						<p className="text-lg text-foreground-600">
							Our platform is designed specifically for healthcare recruitment
							challenges.
						</p>
					</div>

					<Card className="w-full border-none shadow-md">
						<CardBody className="gap-8 md:gap-10 p-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
								<BenefitItem
									icon={<Briefcase className="h-5 w-5" />}
									title="Healthcare Focused"
									description="Tools and features designed specifically for medical job recruitment."
								/>
								<BenefitItem
									icon={<Shield className="h-5 w-5" />}
									title="Compliance Ready"
									description="Built with healthcare compliance and regulations in mind."
								/>
								<BenefitItem
									icon={<Users className="h-5 w-5" />}
									title="Talent Pool Access"
									description="Connect with a dedicated network of healthcare professionals."
								/>
								<BenefitItem
									icon={<CheckCircle className="h-5 w-5" />}
									title="Time Saving"
									description="Reduce time-to-hire with our streamlined recruitment workflow."
								/>
							</div>
						</CardBody>
					</Card>
				</section>
			</div>
			{/* Testimonial/CTA Section */}
			<section className="w-full bg-background-400 rounded-xl p-8 sm:p-12">
				<div className="mx-auto max-w-5xl flex items-start justify-between gap-8 px-4">
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
							href={links.dashboard}
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
