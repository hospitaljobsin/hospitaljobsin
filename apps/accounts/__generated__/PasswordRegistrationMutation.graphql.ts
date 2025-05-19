/**
 * @generated SignedSource<<8acdc69dc66b29bc5b9594859fdb0c96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type PasswordRegistrationMutation$variables = {
  captchaToken: string;
  email: string;
  emailVerificationToken: string;
  fullName: string;
  password: string;
};
export type PasswordRegistrationMutation$data = {
  readonly registerWithPassword: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailVerificationTokenError";
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
  "name": "captchaToken"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "emailVerificationToken"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fullName"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v5 = [
  {
    "kind": "Variable",
    "name": "captchaToken",
    "variableName": "captchaToken"
  },
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
  "type": "InvalidCaptchaTokenError",
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v0/*: any*/)
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
    "cacheID": "154190a9a0904b8c58fff1c358a6bbdf",
    "id": null,
    "metadata": {},
    "name": "PasswordRegistrationMutation",
    "operationKind": "mutation",
    "text": "mutation PasswordRegistrationMutation($email:String!,$emailVerificationToken:String!,$password:String!,$fullName:String!,$captchaToken:String!){registerWithPassword(email:$email,emailVerificationToken:$emailVerificationToken,password:$password,fullName:$fullName,captchaToken:$captchaToken){__typename,...on EmailInUseError{message},...on InvalidEmailVerificationTokenError{message},...on InvalidCaptchaTokenError{message},...on PasswordNotStrongError{message},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "4fe2eabffb0f654cdc11422b52210b26";

export default node;
