/**
 * @generated SignedSource<<d04bdc64a454a45d4bccd8e408238159>>
 * @relayHash 9b1d49c908b7293338038f0a19878075
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9b1d49c908b7293338038f0a19878075

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type GoogleOneTapLoginMutation$variables = {
  token: string;
};
export type GoogleOneTapLoginMutation$data = {
  readonly verifyGoogleToken: {
    readonly __typename: "Account";
    readonly __typename: "Account";
    readonly email: string;
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"AuthNavigationFragment" | "IncompleteProfileBannerFragment" | "JobAuthFragment" | "JobControlsAuthFragment">;
  } | {
    readonly __typename: "InvalidCredentialsError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidEmailError";
    readonly message: string;
  } | {
    readonly __typename: "TwoFactorAuthenticationRequiredError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type GoogleOneTapLoginMutation = {
  response: GoogleOneTapLoginMutation$data;
  variables: GoogleOneTapLoginMutation$variables;
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
  "name": "email",
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
  "type": "InvalidEmailError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "TwoFactorAuthenticationRequiredError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GoogleOneTapLoginMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verifyGoogleToken",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AuthNavigationFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "IncompleteProfileBannerFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "JobAuthFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "JobControlsAuthFragment"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
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
    "name": "GoogleOneTapLoginMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "verifyGoogleToken",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isComplete",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isViewerPayload"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
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
    "id": "9b1d49c908b7293338038f0a19878075",
    "metadata": {},
    "name": "GoogleOneTapLoginMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "54db69393e7b78ad4a8bb7b027555730";

export default node;
