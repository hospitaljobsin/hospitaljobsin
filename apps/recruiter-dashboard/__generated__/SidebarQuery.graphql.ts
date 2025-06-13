/**
 * @generated SignedSource<<c3fad46f08295bc98893ce286360f2a4>>
 * @relayHash 1e72a822c24091326e490c13923fd759
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1e72a822c24091326e490c13923fd759

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SidebarQuery$variables = {
  organizationSlug: string;
};
export type SidebarQuery$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly logoUrl: string;
    readonly name: string;
    readonly slug: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly viewer: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AuthNavigationFragment" | "HeaderDropdownMenuFragment" | "OrganizationSwitcherListFragment">;
  } | {
    readonly __typename: "NotAuthenticatedError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type SidebarQuery = {
  response: SidebarQuery$data;
  variables: SidebarQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organizationSlug"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "organizationSlug"
  }
],
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
  "name": "slug",
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
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/)
  ],
  "type": "Organization",
  "abstractKey": null
},
v7 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = {
  "kind": "InlineFragment",
  "selections": [
    (v8/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SidebarQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AuthNavigationFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "HeaderDropdownMenuFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "OrganizationSwitcherListFragment"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/)
            ],
            "type": "NotAuthenticatedError",
            "abstractKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SidebarQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v7/*: any*/),
                "concreteType": "OrganizationConnection",
                "kind": "LinkedField",
                "name": "organizations",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "OrganizationEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Organization",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v3/*: any*/),
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "organizations(first:10)"
              },
              {
                "alias": null,
                "args": (v7/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "OrganizationSwitcherListFragment_organizations",
                "kind": "LinkedHandle",
                "name": "organizations"
              },
              (v8/*: any*/)
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v6/*: any*/),
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "1e72a822c24091326e490c13923fd759",
    "metadata": {},
    "name": "SidebarQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "68e56cb0f590ecaf685afa920545c1dd";

export default node;
