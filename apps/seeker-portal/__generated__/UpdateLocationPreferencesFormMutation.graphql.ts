/**
 * @generated SignedSource<<d1355fd153d0cb1ae717ba2fc90ef45a>>
 * @relayHash 57501af966ca94c0c9eace04d2eb5906
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 57501af966ca94c0c9eace04d2eb5906

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateLocationPreferencesFormMutation$variables = {
  locationsOpenToWork: ReadonlyArray<string>;
  openToRelocationAnywhere: boolean;
};
export type UpdateLocationPreferencesFormMutation$data = {
  readonly updateProfileLocationPreferences: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"LocationPreferencesFragment" | "UpdateLocationPreferencesFormFragment">;
    } | null | undefined;
  };
};
export type UpdateLocationPreferencesFormMutation = {
  response: UpdateLocationPreferencesFormMutation$data;
  variables: UpdateLocationPreferencesFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationsOpenToWork"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "openToRelocationAnywhere"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "locationsOpenToWork",
    "variableName": "locationsOpenToWork"
  },
  {
    "kind": "Variable",
    "name": "openToRelocationAnywhere",
    "variableName": "openToRelocationAnywhere"
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
    "name": "UpdateLocationPreferencesFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileLocationPreferences",
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
                    "name": "UpdateLocationPreferencesFormFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationPreferencesFragment"
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
    "name": "UpdateLocationPreferencesFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileLocationPreferences",
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
                    "name": "locationsOpenToWork",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "openToRelocationAnywhere",
                    "storageKey": null
                  },
                  (v2/*: any*/)
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
    "id": "57501af966ca94c0c9eace04d2eb5906",
    "metadata": {},
    "name": "UpdateLocationPreferencesFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "5f785214d107b4d841491f52a38dafea";

export default node;
