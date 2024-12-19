import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { graphql, useMutation } from "react-relay";

type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
};

const LogoutModalMutation = graphql`
  mutation LogoutModalMutation {
    logout {
      ... on Account {
        id @deleteRecord
      }
    }
  }
`;

export default function LogoutModal({ isOpen, onOpenChange }: Props) {
	const [commitMutation, isMutationInFlight] = useMutation(LogoutModalMutation);
	const router = useRouter();

	async function handleLogout() {
		commitMutation({
			variables: {},
			updater: (store) => {
				const root = store.getRoot();
				const newViewer = store.create(
					"client:root:viewer",
					"NotAuthenticatedError",
				);
				root.setLinkedRecord(newViewer, "viewer");
			},
			onCompleted(response, errors) {
				if (!errors) {
					router.replace("/auth/login");
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
