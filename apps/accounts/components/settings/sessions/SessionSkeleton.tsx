import { Card, CardHeader } from "@heroui/react";

export default function Session() {
	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardHeader>
				<p>data.userAgent</p>
				<p>data.createdAt</p>
				<p>data.isCurrentSession</p>
			</CardHeader>
		</Card>
	);
}
