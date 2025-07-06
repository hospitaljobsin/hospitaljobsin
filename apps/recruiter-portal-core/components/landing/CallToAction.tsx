import links from "@/lib/links";
import { Button } from "@heroui/react";

export default function CallToAction() {
	return (
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
						href={links.createOrganization()}
						className="font-medium"
					>
						Get Started Now
					</Button>
				</div>
			</div>
		</section>
	);
}
