import type { ShareJobFragment$key } from "@/__generated__/ShareJobFragment.graphql";
import { env } from "@/lib/env";
import links from "@/lib/links";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Snippet,
	Tooltip,
} from "@heroui/react";
import { GlobeIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFragment } from "react-relay";
import {
	LinkedinIcon,
	LinkedinShareButton,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
	XIcon,
} from "react-share";
import { graphql } from "relay-runtime";

export const ShareJobFragment = graphql`
  fragment ShareJobFragment on Job {
    slug
    title
    description
    organization @required(action: THROW) {
        name
        logoUrl
		slug
    }
  }

`;

export default function ShareJob({ job }: { job: ShareJobFragment$key }) {
	const [showShareModal, setShowShareModal] = useState(false);
	const data = useFragment(ShareJobFragment, job);
	const shareUrl = `${env.NEXT_PUBLIC_URL}${links.jobDetail(data.organization.slug, data.slug)}`;
	const title = `Job Position: ${data.title} at ${data.organization.name} - Apply Now!`;
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
			<Tooltip content="Share this job">
				<Button size="lg" variant="light" isIconOnly onPress={handleShare}>
					<Share2Icon
						size={24}
						strokeWidth={1.5}
						className="text-foreground-500"
					/>
				</Button>
			</Tooltip>
			<Modal
				isOpen={showShareModal}
				onClose={() => {
					setShowShareModal(false);
				}}
				className="p-6 w-full"
				size="3xl"
			>
				<ModalContent>
					<ModalHeader className="flex w-full justify-between items-center gap-4 py-6 px-8">
						<div className="flex items-center gap-8">
							<div className="relative h-14 w-14">
								<Image
									alt={data.organization.name}
									src={data.organization.logoUrl}
									fill
									className="object-cover rounded-md"
								/>
							</div>
							<div className="flex flex-col gap-2 items-start">
								<h4 className="text-xl font-medium text-pretty w-full">
									{data.title}
								</h4>
								<p className="text-md font-normal text-foreground-500">
									{data.organization.name}
								</p>
							</div>
						</div>
					</ModalHeader>
					<ModalBody>
						<Snippet
							tooltipProps={{ content: "Copy link" }}
							symbol={<GlobeIcon size={20} className="text-foreground-500" />}
							variant="bordered"
							classNames={{
								pre: "flex gap-4 items-center",
							}}
							fullWidth
						>
							{shareUrl}
						</Snippet>
					</ModalBody>
					<ModalFooter className="flex gap-4 items-center w-full flex-row">
						<p className="text-sm">Share it on</p>
						<TwitterShareButton url={shareUrl} title={title}>
							<XIcon size={32} borderRadius={12} />
						</TwitterShareButton>
						<LinkedinShareButton url={shareUrl} title={title}>
							<LinkedinIcon size={32} borderRadius={12} />
						</LinkedinShareButton>
						<WhatsappShareButton url={shareUrl} title={title}>
							<WhatsappIcon size={32} borderRadius={12} />
						</WhatsappShareButton>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
