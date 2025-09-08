import type { GoogleOneTapLoginMutation as GoogleOneTapLoginMutationType } from '@/__generated__/GoogleOneTapLoginMutation.graphql';
import { env } from '@/lib/env/client';
import links from '@/lib/links';
import { addToast } from '@heroui/react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { usePathname, useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';

const GoogleOneTapLoginMutation = graphql`
mutation GoogleOneTapLoginMutation($token: String!) {
  verifyGoogleToken(token: $token) {
	__typename
	... on Account {
		__typename
		id
		email
		...AuthNavigationFragment
		...IncompleteProfileBannerFragment
		...JobAuthFragment
		...JobControlsAuthFragment
	}
	... on InvalidCredentialsError {
		message
	}
	... on InvalidEmailError {
		message
	}
	... on TwoFactorAuthenticationRequiredError {
		message
	}
  }
}
`;

export default function GoogleOneTapLogin() {
	const router = useRouter();
	const [commitMutation, isMutationInFlight] = useMutation<GoogleOneTapLoginMutationType>(GoogleOneTapLoginMutation);
	const pathName = usePathname();
	useGoogleOneTapLogin({
		onSuccess: credentialResponse => {
			commitMutation({
				variables: {
					token: credentialResponse.credential || ''
				},
				onCompleted(response) {
					if (response.verifyGoogleToken.__typename === 'Account') {
						posthog.identify(response.verifyGoogleToken.id, {
							email: response.verifyGoogleToken.email
						});
						return;
					}
					if (response.verifyGoogleToken.__typename === 'InvalidCredentialsError') {
						addToast({
							title: 'An unexpected error occurred',
							description: response.verifyGoogleToken.message,
							color: 'danger'
						});
					} else if (response.verifyGoogleToken.__typename === 'InvalidEmailError') {
						addToast({
							title: 'Unverified Email Provided',
							description: 'Please use a Google account with a verified email address.',
							color: 'danger'
						});
					} else if (response.verifyGoogleToken.__typename === 'TwoFactorAuthenticationRequiredError') {
						router.push(links.twoFactorAuthentication(`${env.NEXT_PUBLIC_URL}${pathName}`));
					} else {
						console.log('Unexpected response:', response);
					}
				},
				updater(store) {
					store.invalidateStore();
				}
			});
		},
		onError: () => {
			console.log('Login Failed');
		},
		use_fedcm_for_button: true,
		use_fedcm_for_prompt: true
	});
	return <></>;
}
