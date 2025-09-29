import type { UpdateCareerProfileFormFragment$key } from '@/__generated__/UpdateCareerProfileFormFragment.graphql';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { graphql, useFragment, useMutation } from 'react-relay';
import { z } from 'zod/v4';
import { UnsavedChangesFormWrapper } from '../unsaved-changes';

const UpdateCareerProfileFormMutation = graphql`
mutation UpdateCareerProfileFormMutation($certifications: [CertificationInput!]!) {
  updateProfileCertifications(certifications: $certifications) {
    ...on Account {
        ...IncompleteProfileBannerFragment
        ...ResumeProgressAccountFragment
      profile {
          ...UpdateCareerProfileFormFragment
      }
    }
  }
}
`;

const UpdateCareerProfileFormFragment = graphql`
  fragment UpdateCareerProfileFormFragment on Profile {
    __typename
    certifications {
      name
      issuer
      certificationUrl
      createdAt
      expiresAt
    }
  }
`;

type Props = {
	rootQuery: UpdateCareerProfileFormFragment$key;
	onSaveChanges: () => void;
};

const formSchema = z.object({});

export default function UpdateCareerProfileForm({ rootQuery, onSaveChanges }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(UpdateCareerProfileFormMutation);
	const data = useFragment(UpdateCareerProfileFormFragment, rootQuery);
	const {
		handleSubmit,
		control,

		reset,
		formState: { errors, isSubmitting, isDirty, isValid }
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema)
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				certifications: []
			},
			onCompleted() {
				reset(formData);
				onSaveChanges();
			}
		});
	}

	return (
		<UnsavedChangesFormWrapper isDirty={isDirty} isValid={isValid} onSave={handleSubmit(onSubmit)} onCancel={() => reset()}>
			<form className='space-y-12'>
				<div className='pb-6 space-y-6'>
					<h1 className='w-full text-xl text-foreground-500 font-medium'>Career Profile</h1>
				</div>
			</form>
		</UnsavedChangesFormWrapper>
	);
}
