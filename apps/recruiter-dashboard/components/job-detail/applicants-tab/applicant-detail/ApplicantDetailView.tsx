"use client";
import type { ApplicantDetailViewFragment$key } from "@/__generated__/ApplicantDetailViewFragment.graphql";
import PageJobApplicantDetailQuery, {
	type pageJobApplicantDetailQuery,
} from "@/__generated__/pageJobApplicantDetailQuery.graphql";
import ChatInterface from "@/components/chat-interface/ChatInterface";
import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import ApplicantDetails from "./ApplicantDetails";
import ProfileSnapshotView from "./ProfileSnapshotView";

const ApplicantDetailViewFragment = graphql`
 fragment ApplicantDetailViewFragment on Query @argumentDefinitions(
    slug: { type: "String!"}
	applicantSlug: { type: "String!"}
    jobSlug: { type: "String!"}
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
                job(slug: $jobSlug) {
                    __typename
                    ... on Job {
                        ...ApplicantDetails_job
                        jobApplicant(slug: $applicantSlug) {
                            __typename
                            ... on JobApplicant {
                                ...ApplicantDetailsFragment
                                profileSnapshot {
                                    ...ProfileSnapshotViewFragment
                                }
                            }
                        }
                    }
                }
            }
        }

  }
`;

export default function ApplicantDetailView(props: {
	initialQueryRef: PreloadedQuery<pageJobApplicantDetailQuery>;
}) {
	const [showChatPopup, setShowChatPopup] = useState(false);
	const data = usePreloadedQuery(
		PageJobApplicantDetailQuery,
		props.initialQueryRef,
	);
	const query = useFragment<ApplicantDetailViewFragment$key>(
		ApplicantDetailViewFragment,
		data,
	);
	invariant(
		query.organization.__typename === "Organization",
		"`Organization` node type expected.",
	);
	invariant(
		query.organization.job.__typename === "Job" &&
			query.organization.job.jobApplicant.__typename === "JobApplicant",
		"`Job` and `JobApplicant` node type expected.",
	);

	return (
		<div className="flex flex-row h-full">
			<div className="pl-6 py-6 w-full h-full flex flex-col items-start gap-12 overflow-y-auto pr-6">
				<ApplicantDetails
					job={query.organization.job}
					rootQuery={query.organization.job.jobApplicant}
				/>
				<ProfileSnapshotView
					profileSnapshot={query.organization.job.jobApplicant.profileSnapshot}
				/>
			</div>
			<div className="sticky top-0 h-screen min-w-[420px] max-w-[440px] w-full xl:flex flex-col border-l border-foreground-300 hidden">
				<ChatInterface placeholder="Ask me anything about the applicant" />
			</div>
			<div className="block xl:hidden">
				<Button
					isIconOnly
					variant="solid"
					color="primary"
					className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full w-14 h-14 flex items-center justify-center"
					size="lg"
					aria-label="Open chat"
					onPress={() => {
						setShowChatPopup(true);
					}}
				>
					<MessageCircleIcon className="w-7 h-7" />
				</Button>
				<Modal
					isOpen={showChatPopup}
					onOpenChange={(open) => setShowChatPopup(open)}
					className="block xl:hidden"
					backdrop="opaque"
					placement="center"
					size="full"
					motionProps={{
						initial: { opacity: 0, y: "100%" },
						animate: { opacity: 1, y: "0%" },
						exit: { opacity: 0, y: "100%" },
						transition: { type: "spring", stiffness: 400, damping: 40 },
					}}
				>
					<ModalContent className="w-full h-full max-w-full max-h-full rounded-none p-0">
						<ModalBody className="w-full h-full p-0 flex flex-col">
							<ChatInterface placeholder="Ask me anything about the applicant" />
						</ModalBody>
					</ModalContent>
				</Modal>
			</div>
		</div>
	);
}
