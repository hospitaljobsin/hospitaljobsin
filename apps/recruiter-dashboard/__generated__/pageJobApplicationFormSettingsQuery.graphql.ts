/**
 * @generated SignedSource<<df23dd37d322bd8417e45ec79415e7dc>>
 * @relayHash 2bdbc51e3253946624c9c7a100350d8f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2bdbc51e3253946624c9c7a100350d8f

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobApplicationFormSettingsQuery$variables = {
  jobSlug: string;
  orgSlug: string;
};
export type pageJobApplicationFormSettingsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ApplicationFormTabFragment">;
};
export type pageJobApplicationFormSettingsQuery = {
  response: pageJobApplicationFormSettingsQuery$data;
  variables: pageJobApplicationFormSettingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobSlug"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orgSlug"
},
v2 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "orgSlug"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": [
    (v4/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageJobApplicationFormSettingsQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "jobSlug",
            "variableName": "jobSlug"
          },
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "ApplicationFormTabFragment"
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
    "name": "pageJobApplicationFormSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v2/*: any*/)
        ],
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isAdmin",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "slug",
                    "variableName": "jobSlug"
                  }
                ],
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "JobApplicationForm",
                        "kind": "LinkedField",
                        "name": "applicationForm",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ApplicationField",
                            "kind": "LinkedField",
                            "name": "fields",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fieldName",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "defaultValue",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isRequired",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "2bdbc51e3253946624c9c7a100350d8f",
    "metadata": {},
    "name": "pageJobApplicationFormSettingsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "eab16d56e0b0f1ea88f365de059282c1";

export default node;
