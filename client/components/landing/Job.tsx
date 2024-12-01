import { dtf } from "@/lib/intl";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { JobFragment$key } from "./__generated__/JobFragment.graphql";

export const JobFragment = graphql`
  fragment JobFragment on Job {
    id
    title
    description
    location
    salary
    closingDate
    company {
      id
      name
      description
      address
      city
      postcode
    }
  }
`;

type Props = {
  job: JobFragment$key;
  connectionId: string;
};

export default function Job({ job }: Props) {
  const data = useFragment(JobFragment, job);

  return (
    <Link href={`/jobs/${data.id}`} className="group">
      <Card>
        <CardHeader>
          <p className="break-words">{data.title}</p>
          <p>{data.description}</p>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{data.location}</p>
            <p className="text-xs text-muted-foreground">{data.salary}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            closes at {dtf.format(new Date(data.closingDate))}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
