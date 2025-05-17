/**
 * @generated SignedSource<<bac6e88355ddaaeb44904376334880f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasswordRegistrationMutation$variables = {
  email: string;
  emailVerificationToken: string;
  fullName: string;
  password: string;
  recaptchaToken: string;
};
export type PasswordRegistrationMutation$data = {
  readonly registerWithPassword: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailVerificationTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "PasswordNotStrongError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PasswordRegistrationMutation = {
  response: PasswordRegistrationMutation$data;
  variables: PasswordRegistrationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "emailVerificationToken"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fullName"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recaptchaToken"
},
v5 = [
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
    "name": "fullName",
    "variableName": "fullName"
  },
  {
    "kind": "Variable",
    "name": "password",
    "variableName": "password"
  },
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v8 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "EmailInUseError",
  "abstractKey": null
},
v9 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "InvalidEmailVerificationTokenError",
  "abstractKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "InvalidRecaptchaTokenError",
  "abstractKey": null
},
v11 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "PasswordNotStrongError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PasswordRegistrationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "registerWithPassword",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "PasswordRegistrationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "registerWithPassword",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e21304aad5fac86983e170c717631c1a",
    "id": null,
    "metadata": {},
    "name": "PasswordRegistrationMutation",
    "operationKind": "mutation",
    "text": "mutation PasswordRegistrationMutation(\n  $email: String!\n  $emailVerificationToken: String!\n  $password: String!\n  $fullName: String!\n  $recaptchaToken: String!\n) {\n  registerWithPassword(email: $email, emailVerificationToken: $emailVerificationToken, password: $password, fullName: $fullName, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailVerificationTokenError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on PasswordNotStrongError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9e25f443409dc8ed4cb4c3795d0eb5bc";

export default node;
