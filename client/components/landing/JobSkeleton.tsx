import { Card, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";
import { Calendar, MapPin } from "lucide-react";

export default function JobSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex w-full justify-between gap-4 items-center">
          <div className="flex items-center gap-4 w-full">
            <Skeleton className="rounded-full w-16 h-16">
              <div className="w-full" />
            </Skeleton>
            <div className="flex flex-col gap-2 items-start w-full">
              <Skeleton className="rounded-lg w-2/5">
                <h4 className="text-xl font-bold">XXX</h4>
              </Skeleton>
              <Skeleton className="rounded-lg w-1/5">
                <p className="text-md font-normal">XXX</p>
              </Skeleton>
            </div>
          </div>
          <Skeleton className="rounded-lg w-1/5">
            <p className="text-xl font-medium">XXX</p>
          </Skeleton>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center gap-4">
        <Skeleton className="rounded-lg w-1/5">
          <p className="text-foreground-500">XXX</p>
        </Skeleton>
        <div className="flex gap-4 items-center text-foreground-600 w-full justify-end">
          <Skeleton className="rounded-lg w-1/5">
            <div className="flex items-center gap-2">
              <MapPin size={16} /> XXX
            </div>
          </Skeleton>
          <Skeleton className="rounded-lg w-1/5">
            <div className="flex items-center gap-2">
              <Calendar size={16} /> Closing on XXX
            </div>
          </Skeleton>
        </div>
      </CardFooter>
    </Card>
  );
}
