/**
 * @generated SignedSource<<f37c4c4418eb07242c526c24c09c25c9>>
 * @relayHash 5b01eec35cab4226e2204e5014c1e940
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 5b01eec35cab4226e2204e5014c1e940

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateResumeFormMutation$variables = {
  resumeUrl?: string | null | undefined;
};
export type UpdateResumeFormMutation$data = {
  readonly updateProfileResume: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateResumeFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"IncompleteProfileBannerFragment" | "ResumeProgressAccountFragment">;
  };
};
export type UpdateResumeFormMutation = {
  response: UpdateResumeFormMutation$data;
  variables: UpdateResumeFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "resumeUrl"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "resumeUrl",
    "variableName": "resumeUrl"
  }
],
v2 = {
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
    "name": "UpdateResumeFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileResume",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "ResumeProgressAccountFragment"
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
                    "name": "UpdateResumeFormFragment"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateResumeFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileResume",
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
              (v2/*: any*/),
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
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "resumeUrl",
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
              (v2/*: any*/)
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
    "id": "5b01eec35cab4226e2204e5014c1e940",
    "metadata": {},
    "name": "UpdateResumeFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "646176e01e8d0cfba6f86456abbc24ec";

export default node;
