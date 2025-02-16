import links from "@/lib/links";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
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
	const router = useRouter();

	async function handleLogout() {
		commitMutation({
			variables: {},
			onCompleted(response, errors) {
				if (!errors) {
					router.replace(links.login);
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
								isDisabled={isMutationInFlight}
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
