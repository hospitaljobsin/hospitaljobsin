/**
 * @generated SignedSource<<62e8664ac173dfa5936dabde54f47eb2>>
 * @relayHash 067932887517968f3f246da69e0709de
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 067932887517968f3f246da69e0709de

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguageInput = {
  name: string;
  proficiency: string;
};
export type UpdateLanguagesFormMutation$variables = {
  languages: ReadonlyArray<LanguageInput>;
};
export type UpdateLanguagesFormMutation$data = {
  readonly updateProfileLanguages: {
    readonly " $fragmentSpreads": FragmentRefs<"UpdateLanguagesFormFragment">;
  };
};
export type UpdateLanguagesFormMutation = {
  response: UpdateLanguagesFormMutation$data;
  variables: UpdateLanguagesFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "languages"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "languages",
    "variableName": "languages"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateLanguagesFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileLanguages",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateLanguagesFormFragment"
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
    "name": "UpdateLanguagesFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileLanguages",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Language",
                        "kind": "LinkedField",
                        "name": "languages",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "proficiency",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Profile",
                    "abstractKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "067932887517968f3f246da69e0709de",
    "metadata": {},
    "name": "UpdateLanguagesFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "da6c3043258ebacfa0c95c67d38df201";

export default node;
