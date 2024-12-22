import { env } from "@/lib/env";
import links from "@/lib/links";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@nextui-org/react";
import { Share2Icon } from "lucide-react";
import { useState } from "react";
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
import type { ShareJobFragment$key } from "./__generated__/ShareJobFragment.graphql";

export const ShareJobFragment = graphql`
  fragment ShareJobFragment on Job {
    slug
    title
    description
  }

`;

export default function ShareJob({ job }: { job: ShareJobFragment$key }) {
	const [showShareModal, setShowShareModal] = useState(false);
	const data = useFragment(ShareJobFragment, job);
	const shareUrl = `${env.NEXT_PUBLIC_URL}${links.jobDetail(data.slug)}`;
	const title = `Job Position: ${data.title} - Apply Now!`;
	const description = data.description
		? `${data.description.slice(0, 100)}...`
		: undefined;

	async function handleShare() {
		try {
			if (navigator.canShare()) {
				await navigator.share({
					title: title,
					text: description,
					url: shareUrl,
				});
			} else {
				setShowShareModal(true);
			}
		} catch (error) {
			console.error("Error sharing URL: ", error);
			setShowShareModal(true);
		}
	}

	return (
		<>
			<Button size="lg" variant="light" isIconOnly onPress={handleShare}>
				<Share2Icon
					size={24}
					strokeWidth={1.5}
					className="text-foreground-500"
				/>
			</Button>
			<Modal
				isOpen={showShareModal}
				onClose={() => {
					setShowShareModal(false);
				}}
				className="p-6"
			>
				<ModalContent>
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
				</ModalContent>
			</Modal>
		</>
	);
}
