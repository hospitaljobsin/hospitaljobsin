import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";

export default function SessionsControllerSkeleton() {
	return (
		<>
			<Button
				startContent={<Trash2 size={16} />}
				color="danger"
				variant="light"
				isDisabled
				spinnerPlacement="end"
				className="hidden md:flex"
			>
				Delete all sessions
			</Button>
			<Button
				startContent={<Trash2 size={16} />}
				color="danger"
				variant="light"
				isDisabled
				spinnerPlacement="end"
				size="sm"
				className="flex md:hidden"
			>
				Delete all sessions
			</Button>
		</>
	);
}
