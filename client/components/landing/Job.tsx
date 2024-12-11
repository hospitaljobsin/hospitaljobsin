import { dateFormat } from "@/lib/intl";
import {
  Avatar,
  Card,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@nextui-org/react";
import { Briefcase, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { JobFragment$key } from "./__generated__/JobFragment.graphql";

export const JobFragment = graphql`
  fragment JobFragment on Job {
    id
    title
    description
    category
    type
    workMode
    address {
      city
      state
    }
    skills
    currency
    hasSalaryRange
    minSalary
    maxSalary
    hasExperienceRange
    minExperience
    maxExperience
    createdAt
    expiresAt
    company {
      id
      name
      description
      address {
        city
        state
      }
    }
  }
`;

type Props = {
  job: JobFragment$key;
  connectionId: string;
};

export default function Job({ job }: Props) {
  const data = useFragment(JobFragment, job);

  const formattedCreatedAt = dateFormat.format(new Date(data.createdAt));
  const formattedExpiresAt = data.expiresAt
    ? dateFormat.format(new Date(data.expiresAt))
    : "No expiration";

  const salaryRange = data.hasSalaryRange
    ? `${data.currency} ${data.minSalary} - ${data.maxSalary}`
    : "Not disclosed";

  const experienceRange = data.hasExperienceRange
    ? `${data.minExperience} - ${data.maxExperience} years`
    : "Not specified";

  return (
    <Link href={`/jobs/${encodeURIComponent(data.id)}`} className="group">
      <Card isHoverable>
        <CardHeader>
          <div className="flex w-full justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <Avatar name={data.company?.name} size="lg" />
              <div className="flex flex-col gap-2 items-start">
                <h4 className="text-xl font-medium">{data.title}</h4>
                <Tooltip content={data.company?.description} placement="bottom">
                  <p className="text-md font-normal">{data.company?.name}</p>
                </Tooltip>
                <p className="text-sm text-foreground-500">{data.category}</p>
              </div>
            </div>
            <p className="text-xl font-medium">{salaryRange}</p>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-4">
            <p className="text-foreground-500">Posted: {formattedCreatedAt}</p>
            <p className="text-foreground-500">Expires: {formattedExpiresAt}</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center text-foreground-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} />{" "}
              {`${data.address.city}, ${data.address.state}`}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} /> {data.type}
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} /> {data.workMode}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-sm px-2 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-foreground-500">
            Experience: {experienceRange}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
