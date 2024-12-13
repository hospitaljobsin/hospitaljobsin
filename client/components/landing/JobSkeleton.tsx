import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton
} from "@nextui-org/react";

export default function JobSkeleton() {

  return (
      <Card isHoverable fullWidth className="p-6">
        <CardHeader>
          <div className="flex w-full justify-between gap-4 items-center">
            <div className="flex items-center gap-4 w-full">
            <Skeleton className="flex rounded-full w-12 h-12" />
              <div className="flex flex-col gap-2 items-start w-full">
              <Skeleton className="flex rounded-lg w-2/5 h-8" />
              <Skeleton className="flex rounded-lg w-1/5 h-6" />
              </div>
            </div>
            <Skeleton className="flex rounded-lg w-1/5 h-8" />
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-6 w-full">
          <div className="flex justify-between items-center gap-4 w-full">
          <Skeleton className="flex rounded-lg w-1/5 h-4" />
          </div>
          <div className="flex flex-wrap gap-8 items-center text-foreground-600 w-full">
          <Skeleton className="flex rounded-lg w-1/6 h-6" />
          <Skeleton className="flex rounded-lg w-1/6 h-6" />
          <Skeleton className="flex rounded-lg w-1/6 h-6" />
          <Skeleton className="flex rounded-lg w-1/6 h-6" />
          </div>
        </CardBody>
        <CardFooter className="flex flex-col gap-6 w-full">
          <div className="flex flex-wrap gap-4 mt-2 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
             <Skeleton key={index} className="flex rounded-full w-1/12 h-8" />
      ))}
          </div>
        </CardFooter>
      </Card>
  );
}
