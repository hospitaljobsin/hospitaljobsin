"use client";

import {
	Button,
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
			<Card className="p-6 sm:p-12 max-w-2xl" isPressable={false} shadow="none">
				<CardHeader className="flex flex-col gap-6">
					<h2 className="text-lg sm:text-xl font-medium text-center w-full">
						Please authenticate to continue
					</h2>
					<p className="w-full text-balance text-center text-foreground-500 text-small sm:text-base">
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
				<CardFooter className="w-full flex items-center justify-center gap-6 pt-12 max-w-lg mx-auto">
					<Button
						fullWidth
						as={Link}
						href={redirectTo}
						variant="bordered"
						color="default"
					>
						go back
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
