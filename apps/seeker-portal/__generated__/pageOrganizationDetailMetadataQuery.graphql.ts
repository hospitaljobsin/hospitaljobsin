/**
 * @generated SignedSource<<9007120d375eedab0708876760ac13df>>
 * @relayHash fe09d374bfa89b89d355b97a09bbe3ab
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID fe09d374bfa89b89d355b97a09bbe3ab

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationDetailMetadataQuery$variables = {
  slug: string;
};
export type pageOrganizationDetailMetadataQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationDetailMetadataFragment">;
};
export type pageOrganizationDetailMetadataQuery = {
  response: pageOrganizationDetailMetadataQuery$data;
  variables: pageOrganizationDetailMetadataQuery$variables;
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
  "kind": "InlineFragment",
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
      "name": "descriptionCleaned",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "homePageBannerUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "SocialLinks",
      "kind": "LinkedField",
      "name": "socialLinks",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "linkedinUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "youtubeUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "instagramUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "facebookUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageOrganizationDetailMetadataQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageOrganizationDetailMetadataFragment",
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
              (v3/*: any*/)
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
    "name": "pageOrganizationDetailMetadataQuery",
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
          (v3/*: any*/),
          {
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "fe09d374bfa89b89d355b97a09bbe3ab",
    "metadata": {},
    "name": "pageOrganizationDetailMetadataQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "51047ca6953bb13e0287d8cfcc032b6e";

export default node;
