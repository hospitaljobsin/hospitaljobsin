/**
 * @generated SignedSource<<60922d8152786918bece36bb3136cceb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationFormMutation$variables = {
  description?: string | null | undefined;
  location?: string | null | undefined;
  logoUrl?: string | null | undefined;
  name: string;
  organizationId: string;
  slug: string;
  website?: string | null | undefined;
};
export type UpdateOrganizationFormMutation$data = {
  readonly updateOrganization: {
    readonly __typename: "Organization";
    readonly description: string | null | undefined;
    readonly id: string;
    readonly location: string | null | undefined;
    readonly logoUrl: string;
    readonly name: string;
    readonly slug: string;
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
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "logoUrl"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "website"
},
v7 = [
  {
    "kind": "Variable",
    "name": "description",
    "variableName": "description"
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
    "name": "website",
    "variableName": "website"
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v10 = {
  "kind": "InlineFragment",
  "selections": [
    (v9/*: any*/),
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
      "name": "location",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
},
v11 = {
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
      (v6/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateOrganizationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateOrganization",
        "plural": false,
        "selections": [
          (v8/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/)
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
      (v4/*: any*/),
      (v3/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v6/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdateOrganizationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateOrganization",
        "plural": false,
        "selections": [
          (v8/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v9/*: any*/)
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
    "cacheID": "d437b76f35436cedd2a5b806acae18bc",
    "id": null,
    "metadata": {},
    "name": "UpdateOrganizationFormMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateOrganizationFormMutation($organizationId:ID!,$name:String!,$slug:String!,$location:String,$website:String,$logoUrl:String,$description:String){updateOrganization(organizationId:$organizationId,name:$name,slug:$slug,location:$location,website:$website,logoUrl:$logoUrl,description:$description){__typename,...on Organization{id,slug,name,website,description,logoUrl,location},...on OrganizationNotFoundError{__typename},...on OrganizationSlugInUseError{__typename,message},...on OrganizationAuthorizationError{__typename},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "3e23dbaf7a42ce9142da919280e3db46";

export default node;
