import type { EnableWhatsappAlertsFragment$key } from '@/__generated__/EnableWhatsappAlertsFragment.graphql';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import Image from 'next/image';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import { WhatsappIcon } from '../icons';

const EnableWhatsappAlertsFragment = graphql`
fragment EnableWhatsappAlertsFragment on Query {
  viewer {
    __typename
    ... on Account {
        whatsappJobAlertsEnabled
        phoneNumber
    }
  }
}
`;
export default function EnableWhatsappAlerts({ query }: { query: EnableWhatsappAlertsFragment$key }) {
	const data = useFragment(EnableWhatsappAlertsFragment, query);
	invariant(data.viewer.__typename === 'Account');
	if (data.viewer.whatsappJobAlertsEnabled) {
		return (
			<Card shadow='none' className='p-6 sticky h-full'>
				<CardHeader className='flex flex-col gap-2 text-center'>
					{' '}
					<div className='text-lg font-medium'>WhatsApp Job Alerts Enabled</div>
					<div className='text-sm text-gray-600 mb-4'>
						You'll receive notifications about new jobs matching your profile directly on WhatsApp.
					</div>
				</CardHeader>
				<CardBody>
					<Button color='primary' startContent={<WhatsappIcon size={20} />} isDisabled={!data.viewer.phoneNumber}>
						Disable Alerts
					</Button>
				</CardBody>
			</Card>
		);
	}
	return (
		<Card shadow='none' className='px-6 pt-6 pb-0 sticky h-full bg-primary-400/30'>
			<CardHeader className='flex flex-col gap-2 text-center'>
				<div className='text-lg font-medium'>Enable WhatsApp Job Alerts</div>
				<div className='text-sm text-gray-600 mb-4'>
					You'll receive notifications about new jobs matching your profile directly on WhatsApp.
				</div>
			</CardHeader>
			<CardBody>
				<Button color='primary' startContent={<WhatsappIcon size={20} />} isDisabled={!data.viewer.phoneNumber}>
					Enable Alerts
				</Button>
			</CardBody>
			<CardFooter className='pb-0'>
				<div className='flex-1 md:flex items-end w-auto md:h-64 h-32 relative'>
					<Image
						src='/hero-model.png'
						alt='Group of doctors smiling, representing healthcare professionals'
						className='w-auto h-full max-w-full object-cover object-bottom absolute left-0 top-0 z-10'
						loading='eager'
						unoptimized={false}
						width={200}
						height={200}
					/>
					<Image
						src='/hero-model-2.png'
						alt='Group of doctors smiling, representing healthcare professionals'
						className='w-auto h-full max-w-full object-cover object-bottom absolute drop-shadow-lg left-24 sm:left-48 z-20 xl:block'
						loading='eager'
						unoptimized={false}
						width={200}
						height={200}
					/>
				</div>
			</CardFooter>
		</Card>
	);
}
