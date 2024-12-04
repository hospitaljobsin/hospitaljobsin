import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
} from "@nextui-org/react";

export default function JobDetailsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Job Title and Company */}
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="rounded-lg">
                <h1 className="text-3xl font-bold">
                  Consultant Cardiologist (s/i heart failure)
                </h1>
              </Skeleton>
              <Skeleton className="w-3/5 rounded-lg">
                <h3 className="text-md">Company name</h3>
              </Skeleton>
              <span className="text-sm text-default-500">
                <Skeleton />
              </span>
            </div>
            <Skeleton className="rounded-lg">
              <Button>Apply for this Job</Button>
            </Skeleton>
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
              <Skeleton className="rounded-lg w-4/5">
                <li>
                  <strong>Location: XXXX</strong>
                </li>
              </Skeleton>
              <Skeleton className="rounded-lg w-2/5">
                <li>
                  <strong>Salary: XXXX</strong>
                </li>
              </Skeleton>
              <Skeleton className="rounded-lg w-3/5">
                <li>
                  <strong>Closing Date: XX-XX-XXXX</strong>
                </li>
              </Skeleton>
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
            <Skeleton className="rounded-lg w-3/5">
              <p className="text-default-500">Description</p>
            </Skeleton>

            <ul className="text-default-500 space-y-2 mt-2">
              <Skeleton className="rounded-lg w-4/5">
                {" "}
                <li>
                  <strong>Website:</strong> XXXX
                </li>
              </Skeleton>
              <Skeleton className="rounded-lg w-2/5">
                {" "}
                <li>
                  <strong>Email:</strong> XXXX
                </li>
              </Skeleton>
              <Skeleton className="rounded-lg w-3/5">
                <li>
                  <strong>Phone:</strong> XXXX
                </li>
              </Skeleton>
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
          <Skeleton className="rounded-lg w-full h-[800px]">
            <div>Job details</div>
          </Skeleton>
        </CardBody>
      </Card>
    </div>
  );
}
