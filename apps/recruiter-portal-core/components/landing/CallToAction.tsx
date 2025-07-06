import links from "@/lib/links";
import { Button } from "@heroui/react";

export default function CallToAction() {
	return (
		<section className="w-full bg-background-600 rounded-xl sm:p-12 px-4 flex flex-col items-center justify-center gap-8">
			<Button
				variant="solid"
				color="primary"
				size="lg"
				as={"a"}
				href={links.createOrganization()}
				className="font-medium max-w-2xl py-8 text-xl"
				fullWidth
			>
				Get Started Now
			</Button>
		</section>
	);
}
