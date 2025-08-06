import type { JobControlsFragment$key } from "@/__generated__/JobControlsFragment.graphql";
import { Button, useDisclosure } from "@heroui/react";
import { BookPlus, BookX } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import PublishJobModal from "./PublishJobModal";
import UnpublishJobModal from "./UnpublishJobModal";

const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isActive

    ...UnpublishJobModalFragment
    ...PublishJobModalFragment
  }
`;

type Props = {
	job: JobControlsFragment$key;
};

export default function JobControls({ job }: Props) {
	const data = useFragment(JobControlsFragment, job);

	const {
		isOpen: isUnpublishModalOpen,
		onClose: onUnpublishModalClose,
		onOpen: onUnpublishModalOpen,
		onOpenChange: onUnpublishModalOpenChange,
	} = useDisclosure();

	const {
		isOpen: isPublishModalOpen,
		onClose: onPublishModalClose,
		onOpen: onPublishModalOpen,
		onOpenChange: onPublishModalOpenChange,
	} = useDisclosure();

	async function handlePublishJob() {
		onPublishModalOpen();
	}

	function handleUnpublishJob() {
		onUnpublishModalOpen();
	}

	return (
		<>
			{data.isActive ? (
				<Button
					onPress={handleUnpublishJob}
					startContent={<BookX size={20} />}
					className="w-auto"
				>
					Unpublish job
				</Button>
			) : (
				<Button
					color="primary"
					onPress={handlePublishJob}
					startContent={<BookPlus size={20} />}
					className="w-auto"
				>
					Publish job
				</Button>
			)}
			<UnpublishJobModal
				isOpen={isUnpublishModalOpen}
				onClose={onUnpublishModalClose}
				onOpenChange={onUnpublishModalOpenChange}
				job={data}
			/>
			<PublishJobModal
				isOpen={isPublishModalOpen}
				onClose={onPublishModalClose}
				onOpenChange={onPublishModalOpenChange}
				job={data}
			/>
		</>
	);
}
