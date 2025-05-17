/**
 * @generated SignedSource<<806db89ac2cac37e2ed43f5380057895>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type Step2VerificationFormMutation$variables = {
  email: string;
  emailVerificationToken: string;
  recaptchaToken: string;
};
export type Step2VerificationFormMutation$data = {
  readonly verifyEmail: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailVerificationTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "VerifyEmailSuccess";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type Step2VerificationFormMutation = {
  response: Step2VerificationFormMutation$data;
  variables: Step2VerificationFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "emailVerificationToken"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recaptchaToken"
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "emailVerificationToken",
        "variableName": "emailVerificationToken"
      },
      {
        "kind": "Variable",
        "name": "recaptchaToken",
        "variableName": "recaptchaToken"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "verifyEmail",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v1/*: any*/),
        "type": "EmailInUseError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v1/*: any*/),
        "type": "InvalidEmailVerificationTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v1/*: any*/),
        "type": "InvalidRecaptchaTokenError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v1/*: any*/),
        "type": "VerifyEmailSuccess",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Step2VerificationFormMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Step2VerificationFormMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "df26d02466feadf5f4c7bf4fbcbdae85",
    "id": null,
    "metadata": {},
    "name": "Step2VerificationFormMutation",
    "operationKind": "mutation",
    "text": "mutation Step2VerificationFormMutation(\n  $email: String!\n  $emailVerificationToken: String!\n  $recaptchaToken: String!\n) {\n  verifyEmail(email: $email, emailVerificationToken: $emailVerificationToken, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailVerificationTokenError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on VerifyEmailSuccess {\n      message\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5dd61f9eb2c4fe15d654e6df9fe695b7";

export default node;
