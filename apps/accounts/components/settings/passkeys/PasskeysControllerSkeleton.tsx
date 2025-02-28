import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";

export default function PasskeysController() {
	return (
		<>
			<Button
				startContent={<PlusIcon size={16} />}
				variant="light"
				spinnerPlacement="end"
				className="hidden md:flex"
				isDisabled
			>
				Create Passkey
			</Button>
			<Button
				startContent={<PlusIcon size={16} />}
				variant="light"
				spinnerPlacement="end"
				size="sm"
				className="flex md:hidden"
				isDisabled
			>
				Create Passkey
			</Button>
		</>
	);
}
