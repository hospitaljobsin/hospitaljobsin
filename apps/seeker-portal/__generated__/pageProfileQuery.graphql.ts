/**
 * @generated SignedSource<<9094236bc90d45f5ecf57a12af923570>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageProfileQuery$variables = Record<PropertyKey, never>;
export type pageProfileQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ProfileClientComponentFragment">;
};
export type pageProfileQuery = {
  response: pageProfileQuery$data;
  variables: pageProfileQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageProfileQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ProfileClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageProfileQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
                  (v0/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Address",
                        "kind": "LinkedField",
                        "name": "address",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "city",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "country",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "line1",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "line2",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "pincode",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "state",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "gender",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "dateOfBirth",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "maritalStatus",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "category",
                        "storageKey": null
                      },
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
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "57970485c975985a935bb0e984316bc6",
    "id": null,
    "metadata": {},
    "name": "pageProfileQuery",
    "operationKind": "query",
    "text": "query pageProfileQuery {\n  ...ProfileClientComponentFragment\n}\n\nfragment LanguagesFragment on Account {\n  profile {\n    __typename\n    ... on Profile {\n      __typename\n      languages {\n        name\n        proficiency\n      }\n    }\n    ... on ProfileNotFoundError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment PersonalDetailsFragment on Account {\n  profile {\n    __typename\n    ... on Profile {\n      __typename\n      address {\n        city\n        country\n        line1\n        line2\n        pincode\n        state\n      }\n      gender\n      dateOfBirth\n      maritalStatus\n      category\n    }\n    ... on ProfileNotFoundError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ProfileClientComponentFragment on Query {\n  ...ProfileViewFragment\n}\n\nfragment ProfileViewFragment on Query {\n  viewer {\n    __typename\n    ... on Account {\n      ...UpdatePersonalDetailsFormFragment\n      ...PersonalDetailsFragment\n      ...LanguagesFragment\n      ...UpdateLanguagesFormFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment UpdateLanguagesFormFragment on Account {\n  profile {\n    __typename\n    ... on Profile {\n      __typename\n      languages {\n        name\n        proficiency\n      }\n    }\n    ... on ProfileNotFoundError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment UpdatePersonalDetailsFormFragment on Account {\n  profile {\n    __typename\n    ... on Profile {\n      __typename\n      address {\n        city\n        country\n        line1\n        line2\n        pincode\n        state\n      }\n      gender\n      dateOfBirth\n      maritalStatus\n      category\n    }\n    ... on ProfileNotFoundError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d0c3a28f6f5962ba9677fa5652e705f";

export default node;
