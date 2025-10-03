import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { CheckCircle2Icon, GlobeIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useFragment } from 'react-relay';
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
	XIcon
} from 'react-share';
import { graphql } from 'relay-runtime';
import type { ShareJobModalFragment$key } from '@/__generated__/ShareJobModalFragment.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

export const ShareJobModalFragment = graphql`
  fragment ShareJobModalFragment on Job {
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

export default function ShareJobModal({ job, isOpen, onClose }: { job: ShareJobModalFragment$key; isOpen: boolean; onClose: () => void }) {
	const [copied, setCopied] = useState(false);
	const data = useFragment(ShareJobModalFragment, job);
	const shareUrl = `${env.NEXT_PUBLIC_URL}${links.jobDetail(data.organization.slug, data.slug)}`;
	const title = `Job Position: ${data.title} at ${data.organization.name} - Apply Now!`;

	function handleCopy() {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 4000);
	}

	const emailSubject = `Job Opportunity: ${data.title} at ${data.organization.name}`;
	const emailBody = `Hi,%0D%0A%0D%0ACheck out this job opening for ${data.title} at ${data.organization.name}.%0D%0AApply here: ${shareUrl}%0D%0A%0D%0A`;

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
			}}
			className='p-6 w-full z-50'
			size='3xl'
		>
			<ModalContent>
				<ModalHeader className='flex w-full justify-between items-center gap-4 py-6 px-8'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-8'>
						<div className='relative aspect-square h-14 w-14'>
							<Image alt={data.organization.name} src={data.organization.logoUrl} fill className='object-cover rounded-md' />
						</div>
						<div className='flex flex-col gap-2 items-start'>
							<h4 className='text-xl font-medium text-pretty w-full'>{data.title}</h4>
							<p className='text-md font-normal text-foreground-500'>{data.organization.name}</p>
						</div>
					</div>
				</ModalHeader>
				<ModalBody>
					<p className='text-lg mb-4 text-left w-full'>Share this job with your friends or colleagues!</p>
					<div className='flex flex-col items-center gap-4 w-full'>
						<Button
							variant='bordered'
							fullWidth
							className='flex gap-2 items-center justify-center text-base font-medium'
							onClick={handleCopy}
						>
							{copied ? (
								<>
									<CheckCircle2Icon size={20} className='text-success-500' />
									<span>Link copied!</span>
								</>
							) : (
								<>
									<GlobeIcon size={20} className='text-foreground-500' />
									<span>Copy Link</span>
								</>
							)}
						</Button>
					</div>
				</ModalBody>
				<ModalFooter className='flex flex-col sm:flex-row gap-4 sm:items-center w-full justify-start'>
					<p className='text-base mr-2 text-nowrap'>Or share directly:</p>
					<div className='flex w-full flex-row items-center gap-4 flex-wrap'>
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
						<EmailShareButton url={shareUrl} subject={emailSubject} body={emailBody}>
							<EmailIcon size={40} borderRadius={16} />
						</EmailShareButton>
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
