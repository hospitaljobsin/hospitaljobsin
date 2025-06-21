import type { LanguagesFragment$key } from "@/__generated__/LanguagesFragment.graphql";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { LanguagesIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

// TODO: define the fragments on Profile instead
// that should solve partial updates of profiles on account type
const LanguagesFragment = graphql`
  fragment LanguagesFragment on ProfileSnapshot {
        __typename
        languages {
            name
            proficiency
        }
      }
`;

type Props = {
	rootQuery: LanguagesFragment$key;
};

export default function Languages({ rootQuery }: Props) {
	const data = useFragment(LanguagesFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<LanguagesIcon />
						<h1 className="w-full text-sm font-medium">Languages</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.languages.length < 1 ? (
						<h2 className="w-full text-foreground-500">No languages</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.languages.map((language) => (
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
