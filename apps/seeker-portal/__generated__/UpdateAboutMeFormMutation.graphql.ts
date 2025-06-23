/**
 * @generated SignedSource<<1fbf39b32361e380a17abbbf32a7a04b>>
 * @relayHash 28133776891a70b628c2459b3938ce75
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 28133776891a70b628c2459b3938ce75

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateAboutMeFormMutation$variables = {
  headline: string;
  professionalSummary: string;
};
export type UpdateAboutMeFormMutation$data = {
  readonly updateProfileAboutMe: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateAboutMeFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"IncompleteProfileBannerFragment">;
  };
};
export type UpdateAboutMeFormMutation = {
  response: UpdateAboutMeFormMutation$data;
  variables: UpdateAboutMeFormMutation$variables;
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
    "name": "UpdateAboutMeFormMutation",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "IncompleteProfileBannerFragment"
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateAboutMeFormFragment"
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
    "name": "UpdateAboutMeFormMutation",
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
              (v3/*: any*/),
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
                    "name": "isComplete",
                    "storageKey": null
                  },
                  (v3/*: any*/),
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
                  }
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
    "id": "28133776891a70b628c2459b3938ce75",
    "metadata": {},
    "name": "UpdateAboutMeFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "52a217762d00ca7b40e7a3b2f3883796";

export default node;
