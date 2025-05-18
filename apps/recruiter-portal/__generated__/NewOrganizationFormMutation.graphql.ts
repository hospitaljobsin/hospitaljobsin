/**
 * @generated SignedSource<<dde44a05bc507192d5e0f64cbfe6490a>>
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
    "cacheID": "06ae6473399c1a23f7017a3b863f46f4",
    "id": null,
    "metadata": {},
    "name": "NewOrganizationFormMutation",
    "operationKind": "mutation",
    "text": "mutation NewOrganizationFormMutation($fullName:String!,$slug:String!,$website:String,$description:String,$logoUrl:String){createOrganization(fullName:$fullName,slug:$slug,website:$website,description:$description,logoUrl:$logoUrl){__typename,...on Organization{__typename,slug},...on OrganizationSlugInUseError{message},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "d479ee6baa35dd6121976cd065e2911f";

export default node;
