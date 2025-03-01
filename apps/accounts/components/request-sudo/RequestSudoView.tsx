"use client";

import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Link,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { getValidSudoModeRedirectURL } from "../../lib/redirects";
import PasskeyAuthentication from "./PasskeyAuthentication";
import PasswordAuthentication from "./PasswordAuthentication";

export default function RequestSudoView() {
	const searchParams = useSearchParams();
	const redirectTo = getValidSudoModeRedirectURL(searchParams.get("return_to"));
	return (
		<div className="w-full flex flex-col gap-6 h-full min-h-screen items-center justify-center">
			<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
				<CardHeader className="flex flex-col gap-6">
					<h2 className="text-lg font-medium">
						Please authenticate to continue
					</h2>
					<p className="w-full text-balance text-center text-foreground-500">
						You are entering <i>sudo mode</i>, which is needed to perform
						sensitive operations. You won't be asked to authenticate again for a
						while.
					</p>
				</CardHeader>
				<CardBody className="max-w-lg w-full flex flex-col gap-12 pt-12 mx-auto">
					<PasswordAuthentication />
					<div className="w-full flex items-center justify-center gap-6">
						<Divider className="flex-1" />
						<p>or</p>
						<Divider className="flex-1" />
					</div>
					<PasskeyAuthentication />
				</CardBody>
				<CardFooter className="w-full flex items-center justify-center gap-6 pt-12">
					<Link href={redirectTo} className="text-blue-500 hover:underline">
						go back
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
