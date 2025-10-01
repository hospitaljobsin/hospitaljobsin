'use client';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, Progress } from '@heroui/react';
import { AlertCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { CompleteProfileDrawerFragment$key } from '@/__generated__/CompleteProfileDrawerFragment.graphql';
import type { CompleteProfileDrawerJobFragment$key } from '@/__generated__/CompleteProfileDrawerJobFragment.graphql';
import { useJobApplication } from '@/lib/hooks/useJobApplication';
import CompleteProfileContext from './CompleteProfileContext';
import AddressStep from './steps/AddressStep';
import ApplicationFieldStep from './steps/ApplicationFieldStep';
import CareerProfileStep from './steps/CareerProfileStep';
import DateOfBirthStep from './steps/DateOfBirthStep';
import HeadlineStep from './steps/HeadlineStep';
import ResumeUploadStep from './steps/ResumeUploadStep';
import ReviewApplicationStep from './steps/ReviewApplicationStep';

interface CompleteProfileDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	account: CompleteProfileDrawerFragment$key;
	job: CompleteProfileDrawerJobFragment$key;
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
	...AddressStepFragment
	...DateOfBirthStepFragment
	...HeadlineStepFragment
	...CareerProfileStepFragment
}
`;

const CompleteProfileDrawerJobFragment = graphql`
fragment CompleteProfileDrawerJobFragment on Job {
	id
	applicationForm {
		fields {
			fieldName
			defaultValue
			isRequired
		}
	}
}
`;

function CompleteProfileWizard({
	onClose,
	account,
	job
}: {
	onClose: () => void;
	account: CompleteProfileDrawerFragment$key;
	job: CompleteProfileDrawerJobFragment$key;
}) {
	const accountData = useFragment(CompleteProfileDrawerFragment, account);
	const jobData = useFragment(CompleteProfileDrawerJobFragment, job);
	const state = CompleteProfileContext.useSelector(state => state);
	const { send } = CompleteProfileContext.useActorRef();
	const currentStep = CompleteProfileContext.useSelector(state => state.context.currentStep);
	const totalSteps = CompleteProfileContext.useSelector(state => state.context.totalSteps);
	const { applyForJob, isLoading } = useJobApplication();

	const { missingFields, hasResume } = useMemo(() => {
		const profile = accountData.profile;
		const fields: string[] = [];
		if (!profile.dateOfBirth) fields.push('dateOfBirth');
		if (!profile.address) fields.push('address');
		if (!profile.careerProfile?.locationsOpenToWork?.length && !profile.careerProfile?.openToRelocationAnywhere)
			fields.push('careerProfile');
		if (!profile.headline) fields.push('headline');
		return {
			missingFields: fields,
			hasResume: !!profile.resumeUrl
		};
	}, [accountData.profile]);

	useEffect(() => {
		if (state.matches('completed')) {
			const applicationFields = state.context.applicationFields.map(field => ({
				fieldName: field.fieldName,
				fieldValue: field.fieldValue
			}));
			applyForJob(jobData.id, applicationFields).then(() => {
				onClose();
			});
		}
	}, [state, applyForJob, jobData.id, onClose]);

	useEffect(() => {
		if (state.matches('checkingProfile')) {
			const fieldsToProcess = hasResume ? missingFields : ['resume', ...missingFields];
			const applicationFields =
				jobData.applicationForm?.fields?.map(field => ({
					fieldName: field.fieldName,
					fieldValue: '',
					isRequired: field.isRequired,
					defaultValue: field.defaultValue || ''
				})) || [];
			send({
				type: 'START_FORM',
				missingFields: fieldsToProcess,
				applicationFields,
				jobId: jobData.id
			});
		}
	}, [state, send, missingFields, hasResume, jobData]);

	useEffect(() => {
		if (accountData.profile.resumeUrl && !hasResume) {
			send({
				type: 'REFRESH_FIELDS',
				missingFields,
				totalSteps: missingFields.length
			});
		}
	}, [accountData.profile.resumeUrl, hasResume, missingFields, send]);

	const currentField = CompleteProfileContext.useSelector(state => {
		const { missingFields, currentFieldIndex, applicationFields } = state.context;
		if (state.matches('reviewStep') || state.matches('completed')) {
			return 'reviewApplication';
		}
		if (currentFieldIndex < missingFields.length) {
			return missingFields[currentFieldIndex];
		}
		if (applicationFields.length > 0) {
			return 'applicationField';
		}
		return null;
	});

	const isResumeStep = currentField === 'resume';

	const renderStep = () => {
		if (!state.matches('activeStep') && !state.matches('reviewStep') && !state.matches('completed')) return null;

		switch (currentField) {
			case 'resume':
				return <ResumeUploadStep />;
			case 'dateOfBirth':
				return <DateOfBirthStep account={accountData} />;
			case 'address':
				return <AddressStep account={accountData} />;
			case 'careerProfile':
				return <CareerProfileStep account={accountData} />;
			case 'headline':
				return <HeadlineStep account={accountData} />;
			case 'applicationField':
				return <ApplicationFieldStep />;
			case 'reviewApplication':
				return <ReviewApplicationStep isLoading={isLoading} />;
			default:
				return null;
		}
	};

	return (
		<>
			<DrawerHeader className='flex flex-col gap-4'>
				{(isResumeStep || currentField === 'applicationField') && (
					<div className='flex items-center gap-3'>
						<AlertCircle className='w-4 h-4 text-foreground-500' />
						<h2 className='text-sm text-foreground-600 font-medium'>
							{isResumeStep ? 'Complete Your Profile' : 'Fill in these questions asked by recruiters'}
						</h2>
					</div>
				)}
				{totalSteps > 0 && !isResumeStep && currentField !== 'reviewApplication' && !state.matches('completed') && (
					<div className='space-y-2 mr-4'>
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

export default function CompleteProfileDrawer({ isOpen, onClose, account, job }: CompleteProfileDrawerProps) {
	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement='right' size='lg'>
			<DrawerContent>
				<CompleteProfileContext.Provider>
					<CompleteProfileWizard onClose={onClose} account={account} job={job} />
				</CompleteProfileContext.Provider>
			</DrawerContent>
		</Drawer>
	);
}
