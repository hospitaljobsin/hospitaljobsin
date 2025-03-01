"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import PasskeyAuthentication from "./PasskeyAuthentication";

export default function RequestSudoView() {
	return (
		<div className="w-full flex flex-col gap-6">
			<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
				<CardHeader className="flex flex-col gap-2">
					<h2 className="text-lg font-medium">
						Please authenticate to continue
					</h2>
					<p className="w-full text-balance text-center text-foreground-500">
						You are entering sudo mode, which is needed to perform sensitive
						operations. You won't be asked to authenticate again for a while.
					</p>
				</CardHeader>
				<CardBody className="max-w-lg w-full mx-auto">
					<PasskeyAuthentication />
				</CardBody>
				<CardFooter className="max-w-lg w-full mx-auto">
					Facing problems?
				</CardFooter>
			</Card>
		</div>
	);
}
