/**
 * @generated SignedSource<<c987b7f22fe4b4f41d0638c9a6ecc245>>
 * @relayHash 182812fe78fcbecb128de76a8a541682
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 182812fe78fcbecb128de76a8a541682

import type { ConcreteRequest } from 'relay-runtime';
export type SocialLinksInput = {
  facebookUrl?: string | null | undefined;
  instagramUrl?: string | null | undefined;
  linkedinUrl?: string | null | undefined;
  youtubeUrl?: string | null | undefined;
};
export type UpdateOrganizationFormMutation$variables = {
  bannerUrl?: string | null | undefined;
  description?: string | null | undefined;
  homePageBannerUrl?: string | null | undefined;
  location?: string | null | undefined;
  logoUrl?: string | null | undefined;
  name: string;
  organizationId: string;
  slug: string;
  socialLinks?: SocialLinksInput | null | undefined;
  website?: string | null | undefined;
};
export type UpdateOrganizationFormMutation$data = {
  readonly updateOrganization: {
    readonly __typename: "Organization";
    readonly bannerUrl: string;
    readonly description: string | null | undefined;
    readonly homePageBannerUrl: string;
    readonly id: string;
    readonly location: string | null | undefined;
    readonly logoUrl: string;
    readonly name: string;
    readonly slug: string;
    readonly socialLinks: {
      readonly facebookUrl: string | null | undefined;
      readonly instagramUrl: string | null | undefined;
      readonly linkedinUrl: string | null | undefined;
      readonly youtubeUrl: string | null | undefined;
    } | null | undefined;
    readonly website: string | null | undefined;
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    readonly __typename: "OrganizationSlugInUseError";
    readonly __typename: "OrganizationSlugInUseError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type UpdateOrganizationFormMutation = {
  response: UpdateOrganizationFormMutation$data;
  variables: UpdateOrganizationFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "bannerUrl"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "homePageBannerUrl"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "logoUrl"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "socialLinks"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "website"
},
v10 = [
  {
    "kind": "Variable",
    "name": "bannerUrl",
    "variableName": "bannerUrl"
  },
  {
    "kind": "Variable",
    "name": "description",
    "variableName": "description"
  },
  {
    "kind": "Variable",
    "name": "homePageBannerUrl",
    "variableName": "homePageBannerUrl"
  },
  {
    "kind": "Variable",
    "name": "location",
    "variableName": "location"
  },
  {
    "kind": "Variable",
    "name": "logoUrl",
    "variableName": "logoUrl"
  },
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  },
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  },
  {
    "kind": "Variable",
    "name": "socialLinks",
    "variableName": "socialLinks"
  },
  {
    "kind": "Variable",
    "name": "website",
    "variableName": "website"
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v13 = {
  "kind": "InlineFragment",
  "selections": [
    (v12/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
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
      "name": "website",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "logoUrl",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
},
v14 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "OrganizationSlugInUseError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateOrganizationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v10/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateOrganization",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v6/*: any*/),
      (v5/*: any*/),
      (v7/*: any*/),
      (v3/*: any*/),
      (v9/*: any*/),
      (v4/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/),
      (v8/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdateOrganizationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v10/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateOrganization",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v12/*: any*/)
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
    "id": "182812fe78fcbecb128de76a8a541682",
    "metadata": {},
    "name": "UpdateOrganizationFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "6f72cafc8eec3d91710ef569a2e05a53";

export default node;
