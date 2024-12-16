import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { graphql, useFragment } from "react-relay";
import { PersonalDetailsFragment$key } from "./__generated__/PersonalDetailsFragment.graphql";

const PersonalDetailsFragment = graphql`
  fragment PersonalDetailsFragment on Account {
    profile {
      ... on Profile {
        __typename
      }
      ... on ProfileNotFoundError {
        __typename
      }
    }
  }
`;

type Props = {
  rootQuery: PersonalDetailsFragment$key;
};

export default function PersonalDetails({ rootQuery }: Props) {
  const data = useFragment(PersonalDetailsFragment, rootQuery);

  return (
    <Card className="p-6 space-y-6" shadow="sm">
      <CardHeader className="flex gap-6 w-full items-center justify-start">
        <h1 className="w-full text-lg font-medium">Personal Details</h1>
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Gender</h1>
          <h2 className="w-full text-foreground-500">Add your gender</h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Date of Birth</h1>
          <h2 className="w-full text-foreground-500">Add your date of birth</h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Address</h1>
          <h2 className="w-full text-foreground-500">Add your address</h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Marital Status</h1>
          <h2 className="w-full text-foreground-500">
            Add your marital status
          </h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Category</h1>
          <h2 className="w-full text-foreground-500">Add your category</h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Languages</h1>
          <h2 className="w-full text-foreground-500">Add your languages</h2>
        </div>
      </CardBody>
    </Card>
  );
}
