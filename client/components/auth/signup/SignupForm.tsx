"use client";
import SignUpWizard from "./SignupWizard";
import SignupContext from "./machine";

export default function SignupForm() {
	return (
		<SignupContext.Provider>
			<SignUpWizard />
		</SignupContext.Provider>
	);
}
