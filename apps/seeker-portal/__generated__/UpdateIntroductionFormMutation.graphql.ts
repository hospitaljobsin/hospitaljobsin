/**
 * @generated SignedSource<<64d42fee8a5487733cfff30de574b73e>>
 * @relayHash 0f91bfaa8cecdc30d8d4e2274d2018c2
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0f91bfaa8cecdc30d8d4e2274d2018c2

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateIntroductionFormMutation$variables = {
  headline: string;
  professionalSummary: string;
};
export type UpdateIntroductionFormMutation$data = {
  readonly updateProfileAboutMe: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateIntroductionFormFragment">;
    } | null | undefined;
  };
};
export type UpdateIntroductionFormMutation = {
  response: UpdateIntroductionFormMutation$data;
  variables: UpdateIntroductionFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "headline"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "professionalSummary"
},
v2 = [
  {
    "kind": "Variable",
    "name": "headline",
    "variableName": "headline"
  },
  {
    "kind": "Variable",
    "name": "professionalSummary",
    "variableName": "professionalSummary"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateIntroductionFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateIntroductionFormFragment"
                  }
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdateIntroductionFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "professionalSummary",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "headline",
                    "storageKey": null
                  },
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
    "id": "0f91bfaa8cecdc30d8d4e2274d2018c2",
    "metadata": {},
    "name": "UpdateIntroductionFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "8837e49ac037ac53a07caf44addeb4f6";

export default node;
