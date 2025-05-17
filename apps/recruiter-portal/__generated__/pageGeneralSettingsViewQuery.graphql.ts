/**
 * @generated SignedSource<<a2a7705b15a7cb50182800ed7a3ea7f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
    "cacheID": "3eae1ae6994f538b677f42050937f4fe",
    "id": null,
    "metadata": {},
    "name": "pageGeneralSettingsViewQuery",
    "operationKind": "query",
    "text": "query pageGeneralSettingsViewQuery(\n  $slug: String!\n) {\n  ...GeneralSettingsViewClientComponentFragment_20J5Pl\n  ...pageGeneralSettingsMetadataFragment_20J5Pl\n}\n\nfragment DeleteOrganizationModalAccountFragment on Account {\n  id\n}\n\nfragment DeleteOrganizationModalFragment on Organization {\n  id\n  name\n}\n\nfragment GeneralSettingsViewClientComponentFragment_20J5Pl on Query {\n  ...GeneralSettingsViewFragment_20J5Pl\n}\n\nfragment GeneralSettingsViewFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      ...UpdateOrganizationFormFragment\n      ...DeleteOrganizationModalFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  viewer {\n    __typename\n    ... on Account {\n      sudoModeExpiresAt\n      ...DeleteOrganizationModalAccountFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment UpdateOrganizationFormFragment on Organization {\n  id\n  slug\n  name\n  website\n  logoUrl\n  description\n  location\n}\n\nfragment pageGeneralSettingsMetadataFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      name\n      description\n      logoUrl\n      isAdmin\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5062de148022169a3d6a3276bcd62f2c";

export default node;
