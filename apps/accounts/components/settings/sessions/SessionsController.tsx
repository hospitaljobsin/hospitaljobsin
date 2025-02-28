import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";

export default function SessionsController() {
	return (
		<Button startContent={<Trash2 size={16} />} color="danger" variant="light">
			Delete all other sessions
		</Button>
	);
}
