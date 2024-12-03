import { ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID),
    userPoolClientId: String(
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
    ),
  },
};
