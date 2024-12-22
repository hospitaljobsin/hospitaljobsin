import { env } from "@/lib/env";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useFragment } from "react-relay";
import {
	LinkedinIcon,
	LinkedinShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { graphql } from "relay-runtime";
import type { ShareJobModalFragment$key } from "./__generated__/ShareJobModalFragment.graphql";

export const ShareJobModalFragment = graphql`
  fragment ShareJobModalFragment on Job {
    slug
    title
  }

`;

export default function ShareJobModal({
	job,
	isOpen,
	onClose,
}: { job: ShareJobModalFragment$key; isOpen: boolean; onClose: () => void }) {
	const data = useFragment(ShareJobModalFragment, job);
	const shareUrl = `${env.NEXT_PUBLIC_URL}/jobs/${data.slug}`;
	const title = `Job Position: ${data.title} - Apply Now!`;

	return (
		<Modal isOpen={isOpen} onClose={onClose} className="p-6">
			<ModalContent>
				<>
					<ModalHeader className="flex flex-col gap-1">
						Share this Job
					</ModalHeader>
					<ModalBody className="flex gap-4 items-center w-full flex-row">
						<TwitterShareButton url={shareUrl} title={title}>
							<TwitterIcon size={32} borderRadius={12} />
						</TwitterShareButton>
						<LinkedinShareButton url={shareUrl} title={title}>
							<LinkedinIcon size={32} borderRadius={12} />
						</LinkedinShareButton>
						<WhatsappShareButton url={shareUrl} title={title}>
							<WhatsappIcon size={32} borderRadius={12} />
						</WhatsappShareButton>
					</ModalBody>
				</>
			</ModalContent>
		</Modal>
	);
}
