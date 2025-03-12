import type { LanguagesFragment$key } from "@/__generated__/LanguagesFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { EditIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const LanguagesFragment = graphql`
  fragment LanguagesFragment on Account {
    profile {
      ... on Profile {
        __typename
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

	const profileNotFound = data.profile.__typename !== "Profile";

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
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
					{profileNotFound || data.profile.languages.length < 1 ? (
						<h2 className="w-full text-foreground-500">Add your languages</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.profile.languages.map((language) => (
								<div
									className="flex gap-4 flex-col items-center w-full"
									key={`${language.name}-${language.proficiency}`}
								>
									<h3 className="w-full text-foreground-500 text-lg font-medium">
										{language.name}
									</h3>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Proficiency:</p>
										<p className="italic">{language.proficiency}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
