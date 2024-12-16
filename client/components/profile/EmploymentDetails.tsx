import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { graphql, useFragment } from "react-relay";
import { EmploymentDetailsFragment$key } from "./__generated__/EmploymentDetailsFragment.graphql";

const EmploymentDetailsFragment = graphql`
  fragment EmploymentDetailsFragment on Account {
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
  rootQuery: EmploymentDetailsFragment$key;
};

export default function EmploymentDetails({ rootQuery }: Props) {
  const data = useFragment(EmploymentDetailsFragment, rootQuery);

  return (
    <Card className="p-6 space-y-6" shadow="sm">
      <CardHeader className="flex gap-6 w-full items-center justify-start">
        <h1 className="w-full text-lg font-medium">Employment Details</h1>
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Total Experience</h1>
          <h2 className="w-full text-foreground-500">
            Add your total experience
          </h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Current Company Name</h1>
          <h2 className="w-full text-foreground-500">Add your company name</h2>
        </div>
        <div className="flex flex-col gap-2 w-full items-center justify-start">
          <h1 className="w-full text-lg font-medium">Current Job Title</h1>
          <h2 className="w-full text-foreground-500">Add your job title</h2>
        </div>
      </CardBody>
    </Card>
  );
}
