import Image from "next/image";

export default function HealthcareNetwork() {
	return (
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
					We're building a tightly knit network of healthcare professionals from
					the ground up
				</h3>
			</div>
		</section>
	);
}
