/**
 * @generated SignedSource<<bfef610fb376c66f90d3877f73095d25>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageInviteDetailViewQuery$variables = {
  inviteToken: string;
};
export type pageInviteDetailViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"InviteDetailViewClientComponentFragment" | "pageInviteDetailMetadataFragment">;
};
export type pageInviteDetailViewQuery = {
  response: pageInviteDetailViewQuery$data;
  variables: pageInviteDetailViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inviteToken"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "inviteToken",
    "variableName": "inviteToken"
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
  "name": "email",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMember",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageInviteDetailViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageInviteDetailMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organizationInvite",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "createdBy",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "OrganizationInvite",
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
        "name": "InviteDetailViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "pageInviteDetailViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organizationInvite",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "createdBy",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "avatarUrl",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Organization",
                "kind": "LinkedField",
                "name": "organization",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "OrganizationInvite",
            "abstractKey": null
          },
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
    "cacheID": "c9ec2628a20a1dff954b8445a6f218d2",
    "id": null,
    "metadata": {},
    "name": "pageInviteDetailViewQuery",
    "operationKind": "query",
    "text": "query pageInviteDetailViewQuery($inviteToken:String!){...pageInviteDetailMetadataFragment_23AwFq,...InviteDetailViewClientComponentFragment_23AwFq}fragment InviteDetailViewClientComponentFragment_23AwFq on Query{...InviteDetailViewFragment_23AwFq}fragment InviteDetailViewFragment_23AwFq on Query{...InviteFormFragment_23AwFq}fragment InviteFormFragment_23AwFq on Query{organizationInvite(inviteToken:$inviteToken){__typename,...on OrganizationInvite{email,createdBy{fullName,avatarUrl,id},organization{name,logoUrl,slug,id}},...on Node{__isNode:__typename,id}}}fragment pageInviteDetailMetadataFragment_23AwFq on Query{organizationInvite(inviteToken:$inviteToken){__typename,...on OrganizationInvite{email,createdBy{fullName,id},organization{name,logoUrl,isMember,slug,id}},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "78aae516c4943e4896b79127fe7ee1bf";

export default node;
