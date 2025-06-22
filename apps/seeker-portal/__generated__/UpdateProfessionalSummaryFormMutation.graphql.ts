/**
 * @generated SignedSource<<719e9e0a4546c7864469a70c358c27ea>>
 * @relayHash bd10fece27650c362c4ede8113fa7994
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID bd10fece27650c362c4ede8113fa7994

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateProfessionalSummaryFormMutation$variables = {
  professionalSummary: string;
};
export type UpdateProfessionalSummaryFormMutation$data = {
  readonly updateProfileProfessionalSummary: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateProfessionalSummaryFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"IncompleteProfileBannerFragment">;
  };
};
export type UpdateProfessionalSummaryFormMutation = {
  response: UpdateProfessionalSummaryFormMutation$data;
  variables: UpdateProfessionalSummaryFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "professionalSummary"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "professionalSummary",
    "variableName": "professionalSummary"
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
    "name": "UpdateProfessionalSummaryFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileProfessionalSummary",
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
                    "name": "UpdateProfessionalSummaryFormFragment"
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
    "name": "UpdateProfessionalSummaryFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileProfessionalSummary",
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
                    "name": "professionalSummary",
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
    "id": "bd10fece27650c362c4ede8113fa7994",
    "metadata": {},
    "name": "UpdateProfessionalSummaryFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "629fbe4c537fc73d28003c18d73c0a52";

export default node;
