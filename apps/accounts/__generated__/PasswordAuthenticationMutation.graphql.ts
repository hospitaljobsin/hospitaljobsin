/**
 * @generated SignedSource<<8f58d4ba1dfa405e499bb18353b2443b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasswordAuthenticationMutation$variables = {
  password: string;
  recaptchaToken: string;
};
export type PasswordAuthenticationMutation$data = {
  readonly requestSudoModeWithPassword: {
    readonly __typename: "Account";
    readonly __typename: "Account";
  } | {
    readonly __typename: "InvalidAuthenticationProviderError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidCredentialsError";
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
export type PasswordAuthenticationMutation = {
  response: PasswordAuthenticationMutation$data;
  variables: PasswordAuthenticationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "password"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recaptchaToken"
  }
],
v1 = [
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v4 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "InvalidCredentialsError",
  "abstractKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "InvalidRecaptchaTokenError",
  "abstractKey": null
},
v6 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "InvalidAuthenticationProviderError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PasswordAuthenticationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestSudoModeWithPassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PasswordAuthenticationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestSudoModeWithPassword",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
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
    "cacheID": "3fdab89b0b188e933165aeea78f29113",
    "id": null,
    "metadata": {},
    "name": "PasswordAuthenticationMutation",
    "operationKind": "mutation",
    "text": "mutation PasswordAuthenticationMutation(\n  $password: String!\n  $recaptchaToken: String!\n) {\n  requestSudoModeWithPassword(password: $password, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on Account {\n      __typename\n    }\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on InvalidAuthenticationProviderError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "66f3b51922b9a6846649a15bee7bbc05";

export default node;
