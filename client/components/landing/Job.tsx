import { dateFormat } from "@/lib/intl";
import {
  Avatar,
  Card,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@nextui-org/react";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { JobFragment$key } from "./__generated__/JobFragment.graphql";

export const JobFragment = graphql`
  fragment JobFragment on Job {
    id
    title
    location
    salary
    closingDate
    createdAt
    company {
      id
      name
      description
    }
  }
`;

type Props = {
  job: JobFragment$key;
  connectionId: string;
};

export default function Job({ job }: Props) {
  const data = useFragment(JobFragment, job);

  const formattedDate = dateFormat.format(new Date(data.createdAt));

  return (
    <Link href={`/jobs/${encodeURIComponent(data.id)}`} className="group">
      <Card isHoverable>
        <CardHeader>
          <div className="flex w-full justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <Avatar name={data.company?.name} size="lg" />
              <div className="flex flex-col gap-2 items-start">
                <h4 className="text-xl font-bold">{data.title}</h4>
                <Tooltip content={data.company?.description} placement="bottom">
                  <p className="text-md font-normal">{data.company?.name}</p>
                </Tooltip>
              </div>
            </div>
            <p className="text-xl font-medium">
              {data.salary ? `${data.salary}` : "Not disclosed"}
            </p>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between items-center gap-4">
          <p className="text-foreground-500">{formattedDate}</p>
          <div className="flex gap-4 items-center text-foreground-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} /> {data.location}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> Closing on{" "}
              {dateFormat.format(new Date(data.closingDate))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
