/**
 * @generated SignedSource<<a67514d05307ca8c1152c634c15739bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EnableAuthenticator2FAModalMutation$variables = {
  token: string;
};
export type EnableAuthenticator2FAModalMutation$data = {
  readonly enableAccount2faWithAuthenticator: {
    readonly __typename: "EnableAccount2FAWithAuthenticatorSuccess";
    readonly account: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"TwoFactorAuthenticationFragment">;
    };
    readonly recoveryCodes: ReadonlyArray<string>;
  } | {
    readonly __typename: "InvalidCredentialsError";
    readonly message: string;
  } | {
    readonly __typename: "TwoFactorAuthenticationChallengeNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type EnableAuthenticator2FAModalMutation = {
  response: EnableAuthenticator2FAModalMutation$data;
  variables: EnableAuthenticator2FAModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "token"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "token",
    "variableName": "token"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "recoveryCodes",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidCredentialsError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "TwoFactorAuthenticationChallengeNotFoundError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EnableAuthenticator2FAModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "enableAccount2faWithAuthenticator",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "TwoFactorAuthenticationFragment"
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "type": "EnableAccount2FAWithAuthenticatorSuccess",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
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
    "name": "EnableAuthenticator2FAModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "enableAccount2faWithAuthenticator",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "has2faEnabled",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "sudoModeExpiresAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "twoFactorProviders",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "type": "EnableAccount2FAWithAuthenticatorSuccess",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5296ca8da9e09806ce1cebaf76183cb6",
    "id": null,
    "metadata": {},
    "name": "EnableAuthenticator2FAModalMutation",
    "operationKind": "mutation",
    "text": "mutation EnableAuthenticator2FAModalMutation(\n  $token: String!\n) {\n  enableAccount2faWithAuthenticator(token: $token) {\n    __typename\n    ... on EnableAccount2FAWithAuthenticatorSuccess {\n      account {\n        id\n        ...TwoFactorAuthenticationFragment\n      }\n      recoveryCodes\n    }\n    ... on InvalidCredentialsError {\n      message\n    }\n    ... on TwoFactorAuthenticationChallengeNotFoundError {\n      message\n    }\n  }\n}\n\nfragment TwoFactorAuthenticationFragment on Account {\n  has2faEnabled\n  sudoModeExpiresAt\n  twoFactorProviders\n}\n"
  }
};
})();

(node as any).hash = "b739a56b5a523dbb6b3f8a5b110bfefd";

export default node;
