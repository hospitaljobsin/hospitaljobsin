/**
 * @generated SignedSource<<8121cfdde00088bc5bb1e9afea12947b>>
 * @relayHash fd3e1e14e26e7579a5fe9caaa9276048
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID fd3e1e14e26e7579a5fe9caaa9276048

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageResetPasswordViewQuery$variables = {
  email: string;
  resetToken: string;
};
export type pageResetPasswordViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewClientComponentFragment" | "pagePasswordResetTokenMetadataFragment">;
};
export type pageResetPasswordViewQuery = {
  response: pageResetPasswordViewQuery$data;
  variables: pageResetPasswordViewQuery$variables;
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
  "name": "resetToken"
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v3 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "resetToken",
    "variableName": "resetToken"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v2/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageResetPasswordViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pagePasswordResetTokenMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "passwordResetToken",
            "plural": false,
            "selections": [
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "args": (v3/*: any*/),
        "argumentDefinitions": (v2/*: any*/)
      },
      {
        "args": (v3/*: any*/),
        "kind": "FragmentSpread",
        "name": "ResetPasswordViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageResetPasswordViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "passwordResetToken",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "needs2fa",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "twoFactorProviders",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "authProviders",
                "storageKey": null
              }
            ],
            "type": "PasswordResetToken",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "fd3e1e14e26e7579a5fe9caaa9276048",
    "metadata": {},
    "name": "pageResetPasswordViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "11a64098f7a4c4734d02401a66e0fc0d";

export default node;
