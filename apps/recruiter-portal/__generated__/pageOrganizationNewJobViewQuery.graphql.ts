/**
 * @generated SignedSource<<f122c0f50d4b59a2a22ee1e65dbf9a87>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageOrganizationNewJobViewQuery$variables = {
  slug: string;
};
export type pageOrganizationNewJobViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationNewJobViewClientComponentFragment" | "pageOrganizationNewJobMetadataFragment">;
};
export type pageOrganizationNewJobViewQuery = {
  response: pageOrganizationNewJobViewQuery$data;
  variables: pageOrganizationNewJobViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAdmin",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": [
    (v7/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageOrganizationNewJobViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageOrganizationNewJobMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "type": "Organization",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "args": (v1/*: any*/),
        "argumentDefinitions": (v0/*: any*/)
      },
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "OrganizationNewJobViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageOrganizationNewJobViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
              (v7/*: any*/)
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2924a7f31cbdacff496642990b9e7fe5",
    "id": null,
    "metadata": {},
    "name": "pageOrganizationNewJobViewQuery",
    "operationKind": "query",
    "text": "query pageOrganizationNewJobViewQuery(\n  $slug: String!\n) {\n  ...pageOrganizationNewJobMetadataFragment_20J5Pl\n  ...OrganizationNewJobViewClientComponentFragment_20J5Pl\n}\n\nfragment CancelNewJobModalOrganizationFragment on Organization {\n  __typename\n  slug\n}\n\nfragment NewJobFormAccountFragment on Account {\n  __typename\n  fullName\n  avatarUrl\n}\n\nfragment NewJobFormOrganizationFragment on Organization {\n  __typename\n  slug\n  id\n  ...CancelNewJobModalOrganizationFragment\n}\n\nfragment NewJobViewFragment_20J5Pl on Query {\n  viewer {\n    __typename\n    ... on Account {\n      ...NewJobFormAccountFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      ...NewJobFormOrganizationFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment OrganizationNewJobViewClientComponentFragment_20J5Pl on Query {\n  ...NewJobViewFragment_20J5Pl\n}\n\nfragment pageOrganizationNewJobMetadataFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      name\n      description\n      logoUrl\n      isAdmin\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "56d686e567e841e49d9390b842eb498c";

export default node;
