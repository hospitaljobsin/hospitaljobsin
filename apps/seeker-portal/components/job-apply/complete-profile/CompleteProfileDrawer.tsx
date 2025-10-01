'use client';
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Progress } from '@heroui/react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { CompleteProfileDrawerFragment$key } from '@/__generated__/CompleteProfileDrawerFragment.graphql';
import CompleteProfileContext from './CompleteProfileContext';
import AddressStep from './steps/AddressStep';
import CareerProfileStep from './steps/CareerProfileStep';
import DateOfBirthStep from './steps/DateOfBirthStep';
import HeadlineStep from './steps/HeadlineStep';
import ResumeUploadStep from './steps/ResumeUploadStep';

interface CompleteProfileDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	account: CompleteProfileDrawerFragment$key;
	onApply?: () => void;
}

const CompleteProfileDrawerFragment = graphql`
fragment CompleteProfileDrawerFragment on Account {
	profile @required(action: THROW) {
		isComplete
		dateOfBirth
		address
		education {
			__typename
		}
		careerProfile {
			locationsOpenToWork
			openToRelocationAnywhere
		}
		professionalSummary
		headline
		resumeUrl
	}
}
`;

function CompleteProfileWizard({
	onClose,
	missingFields,
	hasResume,
	onApply
}: {
	onClose: () => void;
	missingFields: string[];
	hasResume: boolean;
	onApply?: () => void;
}) {
	const state = CompleteProfileContext.useSelector(state => state);
	const { send } = CompleteProfileContext.useActorRef();
	const currentStep = CompleteProfileContext.useSelector(state => state.context.currentStep);
	const totalSteps = CompleteProfileContext.useSelector(state => state.context.totalSteps);

	useEffect(() => {
		if (state.matches('checkingProfile')) {
			const fieldsToProcess = hasResume ? missingFields : ['resume', ...missingFields];
			send({
				type: 'START_FORM',
				missingFields: fieldsToProcess,
				totalSteps: fieldsToProcess.length,
				onApply
			});
		}
	}, [state, send, missingFields, hasResume]);

	// Handle resume upload completion and field refresh
	useEffect(() => {
		if (state.context.resumeUrl && !hasResume) {
			// Resume was just uploaded, refresh missing fields
			send({
				type: 'REFRESH_FIELDS',
				missingFields,
				totalSteps: missingFields.length
			});
		}
	}, [state.context.resumeUrl, hasResume, missingFields, send]);

	useEffect(() => {
		if (state.matches('completed')) {
			if (onApply) {
				onApply();
			}
			onClose();
		}
	}, [state, onClose, onApply]);

	const currentField = CompleteProfileContext.useSelector(state => {
		const { missingFields, currentFieldIndex } = state.context;
		return missingFields[currentFieldIndex];
	});

	const isResumeStep = currentField === 'resume';

	const renderStep = () => {
		if (!state.matches('activeStep')) return null;

		switch (currentField) {
			case 'resume':
				return <ResumeUploadStep />;
			case 'dateOfBirth':
				return <DateOfBirthStep />;
			case 'address':
				return <AddressStep />;
			case 'careerProfile':
				return <CareerProfileStep />;
			case 'headline':
				return <HeadlineStep />;
			default:
				return null;
		}
	};

	return (
		<>
			<DrawerHeader className='flex flex-col gap-4'>
				<div className='flex items-center gap-3'>
					<div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20'>
						<AlertCircle className='w-5 h-5 text-primary-500' />
					</div>
					<h2 className='text-xl font-semibold'>{isResumeStep ? 'Complete Your Profile' : 'Fill in Missing Information'}</h2>
				</div>
				{totalSteps > 0 && !isResumeStep && (
					<div className='space-y-2'>
						<div className='flex justify-between text-sm text-foreground-600'>
							<span>
								Step {currentStep} of {totalSteps}
							</span>
							<span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
						</div>
						<Progress value={(currentStep / totalSteps) * 100} color='primary' size='sm' />
					</div>
				)}
			</DrawerHeader>
			<DrawerBody>{renderStep()}</DrawerBody>
		</>
	);
}

export default function CompleteProfileDrawer({ isOpen, onClose, account, onApply }: CompleteProfileDrawerProps) {
	const data = useFragment(CompleteProfileDrawerFragment, account);
	const profile = data.profile;
	const hasResume = !!profile.resumeUrl;

	// Determine missing fields
	const missingFields: string[] = [];
	if (!profile.dateOfBirth) missingFields.push('dateOfBirth');
	if (!profile.address) missingFields.push('address');
	if (!profile.careerProfile?.locationsOpenToWork?.length && !profile.careerProfile?.openToRelocationAnywhere)
		missingFields.push('careerProfile');
	if (!profile.headline) missingFields.push('headline');

	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement='right' size='lg'>
			<DrawerContent>
				{profile.isComplete ? (
					<>
						<DrawerHeader>
							<div className='flex items-center gap-3'>
								<div className='flex items-center justify-center w-10 h-10 rounded-full bg-success-50 dark:bg-success-900/20'>
									<CheckCircle className='w-5 h-5 text-success-500' />
								</div>
								<h2 className='text-xl font-semibold'>Profile Complete!</h2>
							</div>
						</DrawerHeader>
						<DrawerBody>
							<p className='text-foreground-600'>Your profile is complete! You can now apply for jobs.</p>
							{onApply && (
								<Button color='primary' size='lg' fullWidth onPress={onApply}>
									Apply for Job
								</Button>
							)}
						</DrawerBody>
					</>
				) : (
					<CompleteProfileContext.Provider>
						<CompleteProfileWizard onClose={onClose} missingFields={missingFields} hasResume={hasResume} onApply={onApply} />
					</CompleteProfileContext.Provider>
				)}
			</DrawerContent>
		</Drawer>
	);
}
