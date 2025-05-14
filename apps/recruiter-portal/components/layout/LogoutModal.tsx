import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { graphql, useMutation } from "react-relay";

type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
};

const LogoutModalMutation = graphql`
  mutation LogoutModalMutation {
    logout {
      __typename
    }
  }
`;

export default function LogoutModal({ isOpen, onOpenChange }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(LogoutModalMutation);

	async function handleLogout() {
		commitMutation({
			variables: {},
			onCompleted(response, errors) {
				if (!errors) {
					// Redirect to login page
					window.location.href = links.login(env.NEXT_PUBLIC_URL);
				}
			},
		});
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Confirm Logout
						</ModalHeader>
						<ModalBody>
							<p>Are you sure you want to logout?</p>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								color="danger"
								onPress={handleLogout}
								isLoading={isMutationInFlight}
							>
								Logout
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
