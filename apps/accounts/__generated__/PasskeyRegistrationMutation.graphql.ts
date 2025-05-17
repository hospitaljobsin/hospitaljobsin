/**
 * @generated SignedSource<<c5dedc66f6a70acb53865dfc0c011817>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyRegistrationMutation$variables = {
  email: string;
  emailVerificationToken: string;
  fullName: string;
  passkeyNickname: string;
  passkeyRegistrationResponse: any;
  recaptchaToken: string;
};
export type PasskeyRegistrationMutation$data = {
  readonly registerWithPasskey: {
    readonly __typename: "EmailInUseError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailVerificationTokenError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidPasskeyRegistrationCredentialError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PasskeyRegistrationMutation = {
  response: PasskeyRegistrationMutation$data;
  variables: PasskeyRegistrationMutation$variables;
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
  "name": "passkeyNickname"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "passkeyRegistrationResponse"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recaptchaToken"
},
v6 = [
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
    "name": "passkeyNickname",
    "variableName": "passkeyNickname"
  },
  {
    "kind": "Variable",
    "name": "passkeyRegistrationResponse",
    "variableName": "passkeyRegistrationResponse"
  },
  {
    "kind": "Variable",
    "name": "recaptchaToken",
    "variableName": "recaptchaToken"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v9 = {
  "kind": "InlineFragment",
  "selections": (v8/*: any*/),
  "type": "EmailInUseError",
  "abstractKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": (v8/*: any*/),
  "type": "InvalidEmailVerificationTokenError",
  "abstractKey": null
},
v11 = {
  "kind": "InlineFragment",
  "selections": (v8/*: any*/),
  "type": "InvalidRecaptchaTokenError",
  "abstractKey": null
},
v12 = {
  "kind": "InlineFragment",
  "selections": (v8/*: any*/),
  "type": "InvalidPasskeyRegistrationCredentialError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PasskeyRegistrationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "registerWithPasskey",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/)
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
      (v4/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "PasskeyRegistrationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "registerWithPasskey",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
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
    "cacheID": "78c3e813f37621d417c18483d89bd335",
    "id": null,
    "metadata": {},
    "name": "PasskeyRegistrationMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyRegistrationMutation(\n  $email: String!\n  $emailVerificationToken: String!\n  $passkeyRegistrationResponse: JSON!\n  $passkeyNickname: String!\n  $fullName: String!\n  $recaptchaToken: String!\n) {\n  registerWithPasskey(email: $email, emailVerificationToken: $emailVerificationToken, passkeyRegistrationResponse: $passkeyRegistrationResponse, passkeyNickname: $passkeyNickname, fullName: $fullName, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on EmailInUseError {\n      message\n    }\n    ... on InvalidEmailVerificationTokenError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on InvalidPasskeyRegistrationCredentialError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "88c5e5b6d7dc85b37af2e460500b4710";

export default node;
