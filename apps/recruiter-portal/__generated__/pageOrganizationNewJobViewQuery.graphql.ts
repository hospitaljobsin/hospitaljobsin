/**
 * @generated SignedSource<<c059ac7ba9c5c6872947256c34cd46f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
    "cacheID": "f108ac0b85a507ed9ccd2dad4d57242f",
    "id": null,
    "metadata": {},
    "name": "pageOrganizationNewJobViewQuery",
    "operationKind": "query",
    "text": "query pageOrganizationNewJobViewQuery($slug:String!){...pageOrganizationNewJobMetadataFragment_20J5Pl,...OrganizationNewJobViewClientComponentFragment_20J5Pl}fragment CancelNewJobModalOrganizationFragment on Organization{__typename,slug}fragment NewJobFormAccountFragment on Account{__typename,fullName,avatarUrl}fragment NewJobFormOrganizationFragment on Organization{__typename,slug,id,...CancelNewJobModalOrganizationFragment}fragment NewJobViewFragment_20J5Pl on Query{viewer{__typename,...on Account{...NewJobFormAccountFragment},...on Node{__isNode:__typename,id}},organization(slug:$slug){__typename,...on Organization{...NewJobFormOrganizationFragment},...on Node{__isNode:__typename,id}}}fragment OrganizationNewJobViewClientComponentFragment_20J5Pl on Query{...NewJobViewFragment_20J5Pl}fragment pageOrganizationNewJobMetadataFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{name,description,logoUrl,isAdmin},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "56d686e567e841e49d9390b842eb498c";

export default node;
