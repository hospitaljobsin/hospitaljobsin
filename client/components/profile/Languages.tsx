import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { EditIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import type { LanguagesFragment$key } from "./__generated__/LanguagesFragment.graphql";

const LanguagesFragment = graphql`
  fragment LanguagesFragment on Account {
    profile {
      ... on Profile {
        __typename
        gender
        dateOfBirth
        address {
            city
            country
            line1
            line2
            pincode
            state
        }
        maritalStatus
        category
        languages {
            name
            proficiency
        }
      }
      ... on ProfileNotFoundError {
        __typename
      }
    }
  }
`;

type Props = {
	rootQuery: LanguagesFragment$key;
	onEditProfile: () => void;
};

export default function Languages({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(LanguagesFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="sm">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<h1 className="w-full text-lg font-medium">Languages</h1>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="light"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					<h2 className="w-full text-foreground-500">Add your languages</h2>
				</CardBody>
			</Card>
		</div>
	);
}
