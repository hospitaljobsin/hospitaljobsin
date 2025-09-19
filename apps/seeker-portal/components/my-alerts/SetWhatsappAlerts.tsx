import type { SetWhatsappAlertsFragment$key } from '@/__generated__/SetWhatsappAlertsFragment.graphql';
import { useCheckSudoMode } from '@/lib/hooks/useCheckSudoMode';
import { Button, Card, CardBody, CardFooter, CardHeader, Tooltip } from '@heroui/react';
import Image from 'next/image';
import { useState } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import invariant from 'tiny-invariant';
import { WhatsappIcon } from '../icons';
import DisableWhatsappJobAlertsModal from './DisableWhatsappJobAlertsModal';
import EnableWhatsappJobAlertsModal from './EnableWhatsappJobAlertsModal';

const SetWhatsappAlertsFragment = graphql`
fragment SetWhatsappAlertsFragment on Query {
	...EnableWhatsappJobAlertsModalFragment
	...DisableWhatsappJobAlertsModalFragment
  viewer {
    __typename
    ... on Account {
        whatsappJobAlertsEnabled
        phoneNumber
		sudoModeExpiresAt
    }
  }
}
`;
export default function SetWhatsappAlerts({ query }: { query: SetWhatsappAlertsFragment$key }) {
	const [showEnableWhatsappJobAlertsModal, setShowEnableWhatsappJobAlertsModal] = useState(false);
	const [showDisableWhatsappJobAlertsModal, setShowDisableWhatsappJobAlertsModal] = useState(false);
	const { checkSudoMode } = useCheckSudoMode();
	const data = useFragment(SetWhatsappAlertsFragment, query);
	invariant(data.viewer.__typename === 'Account');

	function handleEnableWhatsappAlerts() {
		invariant(data.viewer.__typename === 'Account');
		if (data.viewer.phoneNumber) {
			setShowEnableWhatsappJobAlertsModal(true);
			return;
		}
		if (checkSudoMode(data.viewer.sudoModeExpiresAt)) {
			// we need sudo mode to set a phone number on the account
			setShowEnableWhatsappJobAlertsModal(true);
		}
	}

	if (data.viewer.whatsappJobAlertsEnabled) {
		return (
			<>
				<Card shadow='none' className='px-6 pt-6 pb-0 sticky h-full'>
					<CardHeader className='flex flex-col gap-2 text-center'>
						<div className='text-lg font-medium'>WhatsApp Job Alerts Enabled</div>
						<div className='text-sm text-gray-600 mb-4'>
							You'll receive notifications about new jobs matching your profile directly on WhatsApp.
						</div>
					</CardHeader>
					<CardBody>
						<Button
							startContent={<WhatsappIcon className='text-foreground-600' size={20} />}
							isDisabled={!data.viewer.phoneNumber}
							onPress={() => setShowDisableWhatsappJobAlertsModal(true)}
						>
							Disable Alerts
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
								width={750}
								height={750}
							/>
							<Image
								src='/hero-model-2.png'
								alt='Group of doctors smiling, representing healthcare professionals'
								className='w-auto h-full max-w-full object-cover object-bottom absolute drop-shadow-lg left-24 sm:left-48 z-20 xl:block'
								loading='eager'
								unoptimized={false}
								width={750}
								height={750}
							/>
						</div>
					</CardFooter>
				</Card>
				<DisableWhatsappJobAlertsModal
					isOpen={showDisableWhatsappJobAlertsModal}
					onOpenChange={setShowDisableWhatsappJobAlertsModal}
					query={data}
				/>
			</>
		);
	}
	return (
		<>
			<Card shadow='none' className='px-6 pt-6 pb-0 sticky h-full bg-primary-400/30'>
				<CardHeader className='flex flex-col gap-2 text-center'>
					<div className='text-lg font-medium'>Enable WhatsApp Job Alerts</div>
					<div className='text-sm text-gray-600 mb-4'>
						You'll receive notifications about new jobs matching your profile directly on WhatsApp.
					</div>
				</CardHeader>
				<CardBody>
					<Tooltip content='Coming Soon!'>
						<span className='w-full'>
							<Button color='primary' startContent={<WhatsappIcon size={20} />} onPress={handleEnableWhatsappAlerts} isDisabled fullWidth>
								Enable Alerts
							</Button>
						</span>
					</Tooltip>
				</CardBody>
				<CardFooter className='pb-0'>
					<div className='flex-1 md:flex items-center justify-center w-full md:h-64 h-32 relative'>
						<Image
							src='/group-doctors.png'
							alt='Group of doctors smiling, representing healthcare professionals'
							className='h-full max-w-full object-contain object-bottom absolute top-0 z-10'
							loading='eager'
							unoptimized={false}
							width={750}
							height={750}
						/>
					</div>
				</CardFooter>
			</Card>
			<EnableWhatsappJobAlertsModal
				isOpen={showEnableWhatsappJobAlertsModal}
				onOpenChange={setShowEnableWhatsappJobAlertsModal}
				query={data}
			/>
		</>
	);
}
