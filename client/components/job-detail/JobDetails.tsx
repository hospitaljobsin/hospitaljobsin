import { dateFormat } from "@/lib/intl";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Link,
} from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import { graphql, useFragment } from "react-relay";
import { JobDetailsFragment$key } from "./__generated__/JobDetailsFragment.graphql";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Job {
    title
    description
    location
    salary
    closingDate
    createdAt
    company {
      name
      description
      phone
      website
      email
    }
  }
`;

export default function JobDetails({ job }: { job: JobDetailsFragment$key }) {
  const data = useFragment(JobDetailsFragment, job);

  const formattedDate = dateFormat.format(new Date(data.createdAt));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Job Title and Company */}
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{data.title}</h1>
              <h3 className="text-md">{data.company?.name}</h3>
              <span className="text-sm text-default-500">
                Posted on: {formattedDate}
              </span>
            </div>
            <Button
              as="a"
              href="https://github.com/nextui-org/nextui"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Apply for this Job
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Job and Company Details */}
      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-secondary">
              Key Details
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <ul className="text-default-500 space-y-2">
              <li>
                <strong>Location:</strong> {data.location}
              </li>
              <li>
                <strong>Salary:</strong> {data.salary}
              </li>
              <li>
                <strong>Closing Date:</strong> {data.closingDate}
              </li>
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-secondary">
              About the Company
            </h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-default-500">{data.company?.description}</p>
            <ul className="text-default-500 space-y-2 mt-2">
              <li>
                <strong>Website:</strong>{" "}
                <Link
                  isExternal
                  href={data.company?.website || "#"}
                  className="text-primary"
                >
                  {data.company?.website || "N/A"}
                </Link>
              </li>
              <li>
                <strong>Email:</strong> {data.company?.email}
              </li>
              <li>
                <strong>Phone:</strong> {data.company?.phone}
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-secondary">
            About the Job
          </h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <ReactMarkdown className="prose dark:prose-invert prose-h2:text-sm">
            {data.description}
          </ReactMarkdown>
        </CardBody>
      </Card>
    </div>
  );
}
