/**
 * @generated SignedSource<<315d3c73ee5bbbed5381795c1db91d34>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RemoveMemberModalMutation$variables = {
  accountId: string;
  connections: ReadonlyArray<string>;
  organizationId: string;
};
export type RemoveMemberModalMutation$data = {
  readonly removeOrganizationMember: {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationMemberNotFoundError";
    readonly __typename: "OrganizationMemberNotFoundError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    readonly __typename: "RemoveOrganizationMemberSuccess";
    readonly organization: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
    };
    readonly organizationMemberEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type RemoveMemberModalMutation = {
  response: RemoveMemberModalMutation$data;
  variables: RemoveMemberModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "accountId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "accountId",
    "variableName": "accountId"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeOrganizationMember",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationMemberEdge",
                "kind": "LinkedField",
                "name": "organizationMemberEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/)
                    ],
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
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MemberControlsOrganizationFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "RemoveOrganizationMemberSuccess",
            "abstractKey": null
          }
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "RemoveMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeOrganizationMember",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationMemberEdge",
                "kind": "LinkedField",
                "name": "organizationMemberEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "filters": null,
                        "handle": "deleteEdge",
                        "key": "",
                        "kind": "ScalarHandle",
                        "name": "id",
                        "handleArgs": [
                          {
                            "kind": "Variable",
                            "name": "connections",
                            "variableName": "connections"
                          }
                        ]
                      }
                    ],
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "adminCount",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "RemoveOrganizationMemberSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2764e2ac644551f1de083f4fd2c9e754",
    "id": null,
    "metadata": {},
    "name": "RemoveMemberModalMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveMemberModalMutation(\n  $accountId: ID!\n  $organizationId: ID!\n) {\n  removeOrganizationMember(accountId: $accountId, organizationId: $organizationId) {\n    __typename\n    ... on RemoveOrganizationMemberSuccess {\n      organizationMemberEdge {\n        node {\n          id\n        }\n      }\n      organization {\n        id\n        ...MemberControlsOrganizationFragment\n      }\n    }\n    ... on OrganizationNotFoundError {\n      __typename\n    }\n    ... on OrganizationMemberNotFoundError {\n      __typename\n    }\n    ... on OrganizationAuthorizationError {\n      __typename\n    }\n  }\n}\n\nfragment DemoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment MemberControlsOrganizationFragment on Organization {\n  ...RemoveMemberModalOrganizationFragment\n  ...DemoteMemberModalOrganizationFragment\n  ...PromoteMemberModalOrganizationFragment\n  adminCount\n}\n\nfragment PromoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment RemoveMemberModalOrganizationFragment on Organization {\n  id\n}\n"
  }
};
})();

(node as any).hash = "bab0af0e6dbd2d85d99a6d458dd2cac5";

export default node;
