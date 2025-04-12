import type { JobApplyFormFragment$key } from "@/__generated__/JobApplyFormFragment.graphql";
import { graphql, useFragment } from "react-relay";

const JobApplyFormFragment = graphql`
  fragment JobApplyFormFragment on Job {
    applicationForm {
      fields {
        fieldName
        defaultValue
        isRequired
      }
    }
  }
`;

export default function JobApplyForm({
	rootQuery,
}: {
	rootQuery: JobApplyFormFragment$key;
}) {
	const data = useFragment(JobApplyFormFragment, rootQuery);

	return <div className="w-full flex flex-col gap-6">job apply form</div>;
}
