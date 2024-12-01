import { graphql, useFragment } from "react-relay";
import { JobDetailsFragment$key } from "./__generated__/JobDetailsFragment.graphql";

const JobDetailsFragment = graphql`
  fragment JobDetailsFragment on Job {
    title
    description
  }
`;

export default function JobDetails({ job }: { job: JobDetailsFragment$key }) {
  const data = useFragment(JobDetailsFragment, job);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col h-full justify-center gap-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {data.title}
        </h3>
        <p>{data.description}</p>
      </div>
      {/* Display additional fields here */}
      <p className="text-muted-foreground text-sm">
        {/* Posted at {dtf.format(new Date(data.createdAt))} */}
      </p>
    </div>
  );
}
