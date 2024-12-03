import { getErrorMessage } from "@/utils/get-error-message";
import {
  autoSignIn,
  confirmUserAttribute,
  signOut,
  SignUpOutput,
  updatePassword,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
} from "aws-amplify/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function handleSignUpStep(
  step: SignUpOutput["nextStep"],
  router: AppRouterInstance
) {
  switch (step.signUpStep) {
    case "CONFIRM_SIGN_UP":
      // Redirect end-user to confirm-sign up screen.
      router.replace("/auth/confirm-signup");
      break;
    case "COMPLETE_AUTO_SIGN_IN":
      const codeDeliveryDetails = step.codeDeliveryDetails;
      if (codeDeliveryDetails) {
        console.log("code delivery details", codeDeliveryDetails);
        // Redirect user to confirm-sign-up with link screen.
      }
      await autoSignIn();
      router.replace("/");
      break;
  }
}

export async function handleSignOut(router: AppRouterInstance) {
  try {
    await signOut();
  } catch (error) {
    console.error(getErrorMessage(error));
  }
  router.replace("/auth/login");
}

export async function handleUpdateUserAttribute(
  prevState: string,
  formData: FormData
) {
  let attributeKey = "name";
  let attributeValue;
  let currentAttributeValue;

  if (formData.get("email")) {
    attributeKey = "email";
    attributeValue = formData.get("email");
    currentAttributeValue = formData.get("current_email");
  } else {
    attributeValue = formData.get("name");
    currentAttributeValue = formData.get("current_name");
  }

  if (attributeValue === currentAttributeValue) {
    return "";
  }

  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey: String(attributeKey),
        value: String(attributeValue),
      },
    });
    return handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
    return "error";
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      return `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`;
    case "DONE":
      return "success";
  }
}

export async function handleUpdatePassword(
  prevState: "success" | "error" | undefined,
  formData: FormData
) {
  const currentPassword = formData.get("current_password");
  const newPassword = formData.get("new_password");

  if (currentPassword === newPassword) {
    return;
  }

  try {
    await updatePassword({
      oldPassword: String(currentPassword),
      newPassword: String(newPassword),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}

export async function handleConfirmUserAttribute(
  prevState: "success" | "error" | undefined,
  formData: FormData
) {
  const code = formData.get("code");

  if (!code) {
    return;
  }

  try {
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: String(code),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}
