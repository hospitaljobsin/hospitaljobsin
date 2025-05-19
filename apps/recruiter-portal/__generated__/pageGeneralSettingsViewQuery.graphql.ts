/**
 * @generated SignedSource<<c1577490236d02ba5730187d47e91989>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageGeneralSettingsViewQuery$variables = {
  slug: string;
};
export type pageGeneralSettingsViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"GeneralSettingsViewClientComponentFragment" | "pageGeneralSettingsMetadataFragment">;
};
export type pageGeneralSettingsViewQuery = {
  response: pageGeneralSettingsViewQuery$data;
  variables: pageGeneralSettingsViewQuery$variables;
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
    "name": "pageGeneralSettingsViewQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "GeneralSettingsViewClientComponentFragment"
      },
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageGeneralSettingsMetadataFragment",
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
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageGeneralSettingsViewQuery",
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
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "website",
                "storageKey": null
              },
              (v5/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "location",
                "storageKey": null
              },
              (v6/*: any*/)
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
                "name": "sudoModeExpiresAt",
                "storageKey": null
              },
              (v7/*: any*/)
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
    "cacheID": "e54acae2133198628ba0862e1619c520",
    "id": null,
    "metadata": {},
    "name": "pageGeneralSettingsViewQuery",
    "operationKind": "query",
    "text": "query pageGeneralSettingsViewQuery($slug:String!){...GeneralSettingsViewClientComponentFragment_20J5Pl,...pageGeneralSettingsMetadataFragment_20J5Pl}fragment DeleteOrganizationModalAccountFragment on Account{id}fragment DeleteOrganizationModalFragment on Organization{id,name}fragment GeneralSettingsViewClientComponentFragment_20J5Pl on Query{...GeneralSettingsViewFragment_20J5Pl}fragment GeneralSettingsViewFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{...UpdateOrganizationFormFragment,...DeleteOrganizationModalFragment},...on Node{__isNode:__typename,id}},viewer{__typename,...on Account{sudoModeExpiresAt,...DeleteOrganizationModalAccountFragment},...on Node{__isNode:__typename,id}}}fragment UpdateOrganizationFormFragment on Organization{id,slug,name,website,logoUrl,description,location}fragment pageGeneralSettingsMetadataFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{name,description,logoUrl,isAdmin},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "5062de148022169a3d6a3276bcd62f2c";

export default node;
