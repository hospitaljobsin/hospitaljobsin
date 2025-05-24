import type { FragmentRefs, ReaderInlineDataFragment } from "relay-runtime";
export type pageApplicantDetailMetadataFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly isMember: boolean;
				readonly job:
					| {
							readonly __typename: "Job";
							readonly __typename: "Job";
							readonly jobApplicant:
								| {
										readonly __typename: "JobApplicant";
										readonly account:
											| {
													readonly avatarUrl: string;
													readonly fullName: string;
											  }
											| null
											| undefined;
								  }
								| {
										// This will never be '%other', but we need some
										// value in case none of the concrete values match.
										readonly __typename: "%other";
								  };
					  }
					| {
							// This will never be '%other', but we need some
							// value in case none of the concrete values match.
							readonly __typename: "%other";
					  };
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "pageApplicantDetailMetadataFragment";
};
export type pageApplicantDetailMetadataFragment$key = {
	readonly " $data"?: pageApplicantDetailMetadataFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageApplicantDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageApplicantDetailMetadataFragment",
};

(node as any).hash = "e84462338c282a6df7ffc88da2d5b644";

export default node;
