import { dateFormat } from "@/lib/intl";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link
} from "@nextui-org/react";
import { Briefcase, Globe, IndianRupee, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { graphql, useFragment } from "react-relay";
import { JobDetailsFragment$key } from "./__generated__/JobDetailsFragment.graphql";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Job {
    title
    description
    application
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
      logoUrl
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


  // Map currency to icons
  const currencyIcon = (currency: string) => {
    switch (currency) {
      case "INR":
        return <IndianRupee size={14} />;
      default:
        return null; // Handle other currencies or add more cases
    }
  };

  const salaryRange = data.hasSalaryRange ? (
    <div className="flex items-center gap-2 text-xl text-foreground-500">
      {currencyIcon(data.currency)}
      {`${data.minSalary} - ${data.maxSalary}`}{" "}
      <p className="text-sm">/ month</p>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-md text-foreground-500">
      {currencyIcon(data.currency)}
      {"Not disclosed"}
    </div>
  );

  const experienceRange = data.hasExperienceRange
    ? `${data.minExperience} - ${data.maxExperience} years`
    : "Not specified";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Job Title and Company */}
      <Card fullWidth className="p-6">
        <CardHeader>
          <div className="flex w-full justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <Avatar
                name={data.company?.name}
                src={data.company?.logoUrl || undefined}
                size="lg"
              />
              <div className="flex flex-col gap-2 items-start">
                <h4 className="text-xl font-medium">{data.title}</h4>
                <p className="text-md font-normal text-foreground-500">
                  {data.company?.name}
                </p>
              </div>
            </div>
            <Button size="lg">Apply now</Button>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-6 w-full">
          <div className="flex justify-start items-center gap-8 w-full">

            <p className="text-foreground-500 text-md font-normal">
              Posted on {formattedCreatedAt}
            </p>
            {salaryRange}
          </div>
          <div className="flex flex-wrap gap-8 items-center text-foreground-600 w-full">
            <p>{data.type}</p>
            <div className="flex items-center gap-2">
              <MapPin size={16} />{" "}
              {`${data.address.city}, ${data.address.state}`}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} /> {experienceRange}
            </div>

            <div className="flex items-center gap-2">
              <Globe size={16} /> {data.workMode}
            </div>
          </div>
        </CardBody>
       
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
        <div className="flex flex-wrap gap-4 mt-2 w-full">
            {data.skills.map((skill, index) => (
              <Chip variant="flat" key={index}>
                {skill}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
