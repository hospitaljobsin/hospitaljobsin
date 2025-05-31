export default function BenefitItem({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="flex gap-4">
			<div className="p-2 bg-primary-50 rounded-lg h-fit">{icon}</div>
			<div>
				<h4 className="text-lg font-medium">{title}</h4>
				<p className="text-foreground-600">{description}</p>
			</div>
		</div>
	);
}
