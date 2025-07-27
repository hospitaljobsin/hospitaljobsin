import type { ShareJobFragment$key } from "@/__generated__/ShareJobFragment.graphql";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
} from "@heroui/react";
import { CheckCircle2Icon, GlobeIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFragment } from "react-relay";
import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TelegramIcon,
	TelegramShareButton,
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
	const [copied, setCopied] = useState(false);
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

	function handleCopy() {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 4000);
	}

	const emailSubject = `Job Opportunity: ${data.title} at ${data.organization.name}`;
	const emailBody = `Hi,%0D%0A%0D%0ACheck out this job opening for ${data.title} at ${data.organization.name}.%0D%0AApply here: ${shareUrl}%0D%0A%0D%0A`;

	return (
		<>
			<Tooltip content="Share this job">
				<Button
					size="lg"
					variant="light"
					isIconOnly
					data-prevent-progress={true}
					onClick={(event) => {
						event.preventDefault();
						handleShare();
					}}
				>
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
							<div className="relative aspect-square h-14 w-14">
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
						<p className="text-lg mb-4 text-left w-full">
							Share this job with your friends or colleagues!
						</p>
						<div className="flex flex-col items-center gap-4 w-full">
							<Button
								variant="bordered"
								fullWidth
								className="flex gap-2 items-center justify-center text-base font-medium"
								onClick={handleCopy}
							>
								{copied ? (
									<>
										<CheckCircle2Icon size={20} className="text-success-500" />
										<span>Link copied!</span>
									</>
								) : (
									<>
										<GlobeIcon size={20} className="text-foreground-500" />
										<span>Copy Link</span>
									</>
								)}
							</Button>
						</div>
					</ModalBody>
					<ModalFooter className="flex gap-4 items-center w-full flex-row justify-start">
						<p className="text-base mr-2">Or share directly:</p>
						<TwitterShareButton url={shareUrl} title={title}>
							<XIcon size={40} borderRadius={16} />
						</TwitterShareButton>
						<LinkedinShareButton url={shareUrl} title={title}>
							<LinkedinIcon size={40} borderRadius={16} />
						</LinkedinShareButton>
						<FacebookShareButton url={shareUrl}>
							<FacebookIcon size={40} borderRadius={16} />
						</FacebookShareButton>
						<TelegramShareButton url={shareUrl} title={title}>
							<TelegramIcon size={40} borderRadius={16} />
						</TelegramShareButton>
						<WhatsappShareButton url={shareUrl} title={title}>
							<WhatsappIcon size={40} borderRadius={16} />
						</WhatsappShareButton>
						<EmailShareButton
							url={shareUrl}
							subject={emailSubject}
							body={emailBody}
						>
							<EmailIcon size={40} borderRadius={16} />
						</EmailShareButton>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
