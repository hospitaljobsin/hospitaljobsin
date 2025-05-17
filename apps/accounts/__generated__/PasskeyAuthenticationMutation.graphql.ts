/**
 * @generated SignedSource<<864f389f69017c49afd0875637f5c679>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PasskeyAuthenticationMutation$variables = {
  authenticationResponse: any;
  recaptchaToken: string;
};
export type PasskeyAuthenticationMutation$data = {
  readonly requestSudoModeWithPasskey: {
    readonly __typename: "Account";
    readonly __typename: "Account";
  } | {
    readonly __typename: "InvalidPasskeyAuthenticationCredentialError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidRecaptchaTokenError";
    readonly message: string;
  } | {
    readonly __typename: "WebAuthnChallengeNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PasskeyAuthenticationMutation = {
  response: PasskeyAuthenticationMutation$data;
  variables: PasskeyAuthenticationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "authenticationResponse"
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
    "name": "authenticationResponse",
    "variableName": "authenticationResponse"
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
  "type": "InvalidPasskeyAuthenticationCredentialError",
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
  "type": "WebAuthnChallengeNotFoundError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PasskeyAuthenticationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestSudoModeWithPasskey",
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
    "name": "PasskeyAuthenticationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestSudoModeWithPasskey",
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
    "cacheID": "a59deb2672d2eaa66d079688b69623c8",
    "id": null,
    "metadata": {},
    "name": "PasskeyAuthenticationMutation",
    "operationKind": "mutation",
    "text": "mutation PasskeyAuthenticationMutation(\n  $authenticationResponse: JSON!\n  $recaptchaToken: String!\n) {\n  requestSudoModeWithPasskey(authenticationResponse: $authenticationResponse, recaptchaToken: $recaptchaToken) {\n    __typename\n    ... on Account {\n      __typename\n    }\n    ... on InvalidPasskeyAuthenticationCredentialError {\n      message\n    }\n    ... on InvalidRecaptchaTokenError {\n      message\n    }\n    ... on WebAuthnChallengeNotFoundError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8cb27f53078d39dbe9f09c83297332e8";

export default node;
