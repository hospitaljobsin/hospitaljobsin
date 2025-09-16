'use client';

import type { CreateJobAlertModalMutation as CreateJobAlertMutationType } from '@/__generated__/CreateJobAlertModalMutation.graphql';
import { addToast, Modal, ModalContent, ModalHeader } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellIcon } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-relay';
import { ConnectionHandler, graphql } from 'relay-runtime';
import StepProgress from '../StepProgress';
import type { CreateAlertFormValues } from './JobAlertFormMachine';
import JobAlertFormContext, { createAlertSchema } from './JobAlertFormMachine';
import JobAlertFormProvider from './JobAlertFormProvider';
import JobAlertStep1 from './JobAlertStep1';
import JobAlertStep2 from './JobAlertStep2';
import JobAlertStep3 from './JobAlertStep3';
import JobAlertStep4 from './JobAlertStep4';

const CreateJobAlertMutation = graphql`
mutation CreateJobAlertModalMutation( $filters: AlertFiltersInput!, $frequency: JobAlertFrequency! ) {
  createJobAlert(filters: $filters, frequency: $frequency) {
    __typename
    ... on JobAlert {
        __typename
        ...JobAlertFragment
    }
    ... on JobAlertAlreadyExistsError {
        message
    }
  }
}
`;

interface CreateJobAlertModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

function CreateJobAlertModalContent({ isOpen, onOpenChange }: CreateJobAlertModalProps) {
	const [createJobAlert, isCreatingJobAlert] = useMutation<CreateJobAlertMutationType>(CreateJobAlertMutation);
	const { send } = JobAlertFormContext.useActorRef();
	const state = JobAlertFormContext.useSelector(state => state.value);
	// Convert state to string for easier comparison
	const currentState = state.toString();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<CreateAlertFormValues>({
		resolver: zodResolver(createAlertSchema),
		defaultValues: {
			searchTerm: '',
			jobType: [],
			workMode: [],
			location: null,
			minExperience: null,
			maxExperience: null,
			minSalary: null,
			maxSalary: null,
			frequency: 'WEEKLY' // Default frequency
		},
		mode: 'onChange'
	});

	// Get current step based on state
	const getCurrentStep = (): number => {
		if (currentState === 'step1') return 1;
		if (currentState === 'step2') return 2;
		if (currentState === 'step3') return 3;
		if (currentState === 'step4') return 4;
		return 1;
	};

	// Reset form and state machine when modal closes
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			reset();
			// Reset the state machine to step 1 directly
			// If we're in 'complete' state, use RESET, otherwise use BACK
			if (currentState === 'complete') {
				send({ type: 'RESET' });
			} else if (currentState !== 'step1') {
				// If we're in any other state, navigate back to step1
				send({ type: 'BACK' });
				if (currentState !== 'step1') {
					send({ type: 'BACK' });
					if (currentState !== 'step1') {
						send({ type: 'BACK' });
					}
				}
			}
		}
		onOpenChange(open);
	};

	// Since we're not using the XState context anymore with our simplified machine,
	// we don't need to sync form values from XState context

	const onSubmit = (data: CreateAlertFormValues) => {
		createJobAlert({
			variables: {
				filters: {
					searchTerm: data.searchTerm,
					jobType: data.jobType?.length ? data.jobType : null,
					workMode: data.workMode?.length ? data.workMode : null,
					location: data.location || null,
					minExperience: data.minExperience,
					maxExperience: data.maxExperience,
					minSalary: data.minSalary,
					maxSalary: data.maxSalary
				},
				frequency: data.frequency
			},
			updater: store => {
				// Get the payload from the store
				const payload = store.getRootField('createJobAlert');
				if (!payload || payload.getType() !== 'JobAlert') {
					// Not a successful creation
					return;
				}

				// Retrieve the connection from the store
				const rootRecord = store.getRoot();
				const connectionRecord = ConnectionHandler.getConnection(rootRecord, 'JobAlertsListFragment_jobAlerts');

				// Only update if the connection exists
				if (connectionRecord) {
					// Create a new edge with the payload
					const newEdge = ConnectionHandler.createEdge(store, connectionRecord, payload, 'JobAlertEdge');
					// Insert the new edge at the beginning of the connection
					ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
				}
			},
			onCompleted: response => {
				if (response.createJobAlert.__typename === 'JobAlert') {
					addToast({
						title: 'Success!',
						description: 'Job alert created successfully',
						color: 'success'
					});
					// Reset the state machine to step1 before closing the modal
					send({ type: 'RESET' });
					handleOpenChange(false);
				} else if (response.createJobAlert.__typename === 'JobAlertAlreadyExistsError') {
					addToast({
						title: 'Error',
						description: response.createJobAlert.message,
						color: 'danger'
					});
				}
			},
			onError: error => {
				addToast({
					title: 'Error',
					description: 'Failed to create job alert. Please try again.',
					color: 'danger'
				});
				console.error('Error creating job alert:', error);
			}
		});
	};

	// Render the appropriate step based on the state
	const renderStep = (control: Control<CreateAlertFormValues>) => {
		switch (currentState) {
			case 'step1':
				return <JobAlertStep1 control={control} errors={errors} />;
			case 'step2':
				return <JobAlertStep2 control={control} errors={errors} />;
			case 'step3':
				return <JobAlertStep3 control={control} errors={errors} />;
			case 'step4':
				return <JobAlertStep4 control={control} errors={errors} handleSubmit={handleSubmit(onSubmit)} isSubmitting={isCreatingJobAlert} />;
			default:
				return <JobAlertStep1 control={control} errors={errors} />;
		}
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={handleOpenChange} size='3xl' className='p-6' scrollBehavior='inside'>
			<ModalContent className='max-h-[90vh]'>
				<ModalHeader className='flex items-center gap-2 pb-2 font-medium text-foreground-600 text-sm'>
					<BellIcon className='h-5 w-5 text-foreground-600' />
					Create Job Alert
				</ModalHeader>

				<div className='px-6 py-4'>
					<StepProgress currentStep={getCurrentStep()} totalSteps={4} />
				</div>

				<div className='px-6 py-4 overflow-y-auto'>{renderStep(control)}</div>
			</ModalContent>
		</Modal>
	);
}

// Wrap with provider

export default function CreateJobAlertModal(props: CreateJobAlertModalProps) {
	return (
		<JobAlertFormProvider>
			<CreateJobAlertModalContent {...props} />
		</JobAlertFormProvider>
	);
}
