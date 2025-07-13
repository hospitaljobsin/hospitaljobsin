import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import AutofillWithAIModal from "./AutofillWithAIModal";

export default function AutofillWithAISection() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Open modal directly (confirmation is now handled by checkbox)
	const handleAutofillClick = () => {
		setIsModalOpen(true);
	};

	return (
		<Card className="p-6" shadow="none">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
				<div className="flex items-center gap-2">
					<Sparkles className="text-primary" size={20} />
					<span className="font-semibold text-lg">Autofill with AI</span>
				</div>
				<span className="text-sm text-muted-foreground mt-1 sm:mt-0 sm:ml-4">
					Upload your resume to quickly fill your profile.
				</span>
			</CardHeader>
			<CardBody>
				<Button variant="flat" size="md" onPress={handleAutofillClick}>
					<Sparkles className="mr-2" size={18} />
					Autofill with AI
				</Button>
				<AutofillWithAIModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
					}}
				/>
			</CardBody>
		</Card>
	);
}
