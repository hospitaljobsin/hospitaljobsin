import type { PhoneNumberFragment$key } from "@/__generated__/PhoneNumberFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const PhoneNumberFragment = graphql`
  fragment PhoneNumberFragment on Account {
    phoneNumber
  }
`;

type Props = {
	rootQuery: PhoneNumberFragment$key;
	onUpdatePhoneNumber: () => void;
};

export default function PhoneNumber({ rootQuery, onUpdatePhoneNumber }: Props) {
	const data = useFragment(PhoneNumberFragment, rootQuery);
	const [isPhoneVisible, setIsPhoneVisible] = useState(false);

	const redactPhoneNumber = (phoneNumber: string) => {
		if (phoneNumber.length <= 8) {
			return "*".repeat(phoneNumber.length);
		}
		return phoneNumber.slice(0, -8) + "*".repeat(8);
	};

	return (
		<Card className="p-4 sm:p-6" shadow="none">
			<CardHeader className="flex flex-col gap-4 items-start">
				<h2 className="text-md font-medium text-foreground-500">
					Phone Number
				</h2>
			</CardHeader>
			<CardBody>
				<div className="w-full flex flex-col gap-12">
					<div className="w-full flex flex-col gap-6">
						{data.phoneNumber && (
							<div className="flex flex-col gap-2 w-full">
								<div className="flex items-center gap-4">
									<span className="text-base text-foreground-400">
										{isPhoneVisible
											? data.phoneNumber
											: redactPhoneNumber(data.phoneNumber)}
									</span>
									<Button
										onPress={() => setIsPhoneVisible(!isPhoneVisible)}
										variant="light"
									>
										{isPhoneVisible ? "Hide" : "Reveal"}
									</Button>
								</div>
							</div>
						)}
						<Button
							onPress={onUpdatePhoneNumber}
							fullWidth
							startContent={<Edit size={16} />}
							variant="solid"
						>
							{data.phoneNumber ? "Update" : "Add"} Phone Number
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
