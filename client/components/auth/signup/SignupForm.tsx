"use client";
import SignupContext from "./SignupContext";
import SignUpWizard from "./SignupWizard";

export default function SignupForm() {
	return (
		<SignupContext.Provider>
			<SignUpWizard />
		</SignupContext.Provider>
	);
}
