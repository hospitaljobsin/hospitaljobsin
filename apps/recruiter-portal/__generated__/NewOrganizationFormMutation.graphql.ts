/**
 * @generated SignedSource<<b1f447b58ee397ebce8964fb49eaac92>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type NewOrganizationFormMutation$variables = {
  description?: string | null | undefined;
  fullName: string;
  logoUrl?: string | null | undefined;
  slug: string;
  website?: string | null | undefined;
};
export type NewOrganizationFormMutation$data = {
  readonly createOrganization: {
    readonly __typename: "Organization";
    readonly __typename: "Organization";
    readonly slug: string;
  } | {
    readonly __typename: "OrganizationSlugInUseError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type NewOrganizationFormMutation = {
  response: NewOrganizationFormMutation$data;
  variables: NewOrganizationFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fullName"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "logoUrl"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "website"
},
v5 = [
  {
    "kind": "Variable",
    "name": "description",
    "variableName": "description"
  },
  {
    "kind": "Variable",
    "name": "fullName",
    "variableName": "fullName"
  },
  {
    "kind": "Variable",
    "name": "logoUrl",
    "variableName": "logoUrl"
  },
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  },
  {
    "kind": "Variable",
    "name": "website",
    "variableName": "website"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
},
v8 = {
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
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewOrganizationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createOrganization",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
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
      (v1/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "NewOrganizationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createOrganization",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
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
    "cacheID": "16930473a18eb71df860e1621eedc7ee",
    "id": null,
    "metadata": {},
    "name": "NewOrganizationFormMutation",
    "operationKind": "mutation",
    "text": "mutation NewOrganizationFormMutation(\n  $fullName: String!\n  $slug: String!\n  $website: String\n  $description: String\n  $logoUrl: String\n) {\n  createOrganization(fullName: $fullName, slug: $slug, website: $website, description: $description, logoUrl: $logoUrl) {\n    __typename\n    ... on Organization {\n      __typename\n      slug\n    }\n    ... on OrganizationSlugInUseError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d479ee6baa35dd6121976cd065e2911f";

export default node;
