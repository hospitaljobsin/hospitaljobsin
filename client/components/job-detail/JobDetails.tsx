import { dateFormat } from "@/lib/intl";
import {
  Avatar,
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
    category
    type
    workMode
    address {
      line1
      line2
      city
      state
      country
      pincode
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
      name
      description
      address {
        line1
        city
        state
        country
      }
      phone
      website
      email
    }
  }
`;

export default function JobDetails({ job }: { job: JobDetailsFragment$key }) {
  const data = useFragment(JobDetailsFragment, job);

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
    <div className="w-full flex flex-col gap-6">
      {/* Job Title and Company */}
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-medium">{data.title}</h1>
              <h3 className="text-md">{data.company?.name}</h3>
              <span className="text-sm text-default-500">
                Posted on: {formattedCreatedAt}
              </span>
            </div>
            <Button
              as="a"
              href={data.application}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
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
                <strong>Location:</strong>{" "}
                {`${data.address.city}, ${data.address.state}`}
              </li>
              <li>
                <strong>Salary:</strong> {salaryRange}
              </li>
              <li>
                <strong>Closing Date:</strong> {formattedExpiresAt}
              </li>
              <li>
                <strong>Experience:</strong> {experienceRange}
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
            <div className="flex gap-6 items-center">
              <Avatar
                name={data.company?.name}
                size="lg"
                className="h-24 w-24"
              />
              <div>
                <p className="text-default-500">{data.company?.description}</p>
                <ul className="text-default-500 space-y-2 mt-2">
                  <li>
                    <strong>Address:</strong>{" "}
                    {`${data.company?.address?.line1}, ${data.company?.address?.city}, ${data.company?.address?.state}, ${data.company?.address?.country}`}
                  </li>
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
              </div>
            </div>
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

      {/* Skills */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-secondary">
            Required Skills
          </h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-sm px-2 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
