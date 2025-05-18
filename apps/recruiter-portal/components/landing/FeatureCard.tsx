import { Card, CardBody } from "@heroui/react";

export default function FeatureCard({
	icon,
	title,
	description,
}: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<Card className="border-none shadow-md h-full">
			<CardBody className="p-6 flex flex-col gap-4 items-center text-center">
				<div className="p-3 bg-primary-50 rounded-full">{icon}</div>
				<h3 className="text-xl font-medium">{title}</h3>
				<p className="text-foreground-600">{description}</p>
			</CardBody>
		</Card>
	);
}
