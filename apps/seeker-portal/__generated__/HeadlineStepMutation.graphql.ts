/**
 * @generated SignedSource<<b49c95d1c2938a4a06b4e09542f691c3>>
 * @relayHash fbd43f5cdbd59e32a5883fa1c3350983
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID fbd43f5cdbd59e32a5883fa1c3350983

import type { ConcreteRequest } from 'relay-runtime';
export type HeadlineStepMutation$variables = {
  headline: string;
};
export type HeadlineStepMutation$data = {
  readonly updateProfileAboutMe: {
    readonly profile?: {
      readonly headline: string | null | undefined;
    } | null | undefined;
  };
};
export type HeadlineStepMutation = {
  response: HeadlineStepMutation$data;
  variables: HeadlineStepMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "headline"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "headline",
    "variableName": "headline"
  },
  {
    "kind": "Literal",
    "name": "professionalSummary",
    "value": ""
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headline",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HeadlineStepMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileAboutMe",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          }
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
    "name": "HeadlineStepMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileAboutMe",
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
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
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
    "id": "fbd43f5cdbd59e32a5883fa1c3350983",
    "metadata": {},
    "name": "HeadlineStepMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "5db792e2ac06635e08a4fd98ed192fea";

export default node;
