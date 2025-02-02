"use client";
import SignUpWizard from "./SignupWizard";
import SignupContext from "./signupMachine";

export default function SignupForm() {
	return (
		<SignupContext.Provider>
			<SignUpWizard />
		</SignupContext.Provider>
	);
}
