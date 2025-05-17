/**
 * @generated SignedSource<<73c9f0b752dac4a5147f0fa8ec9f091c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DemoteMemberModalMutation$variables = {
  accountId: string;
  connections: ReadonlyArray<string>;
  organizationId: string;
};
export type DemoteMemberModalMutation$data = {
  readonly demoteOrganizationMember: {
    readonly __typename: "DemoteOrganizationMemberSuccess";
    readonly organization: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
    };
    readonly organizationMemberEdge: {
      readonly " $fragmentSpreads": FragmentRefs<"MemberFragment">;
    };
  } | {
    readonly __typename: "InsufficientOrganizationAdminsError";
    readonly __typename: "InsufficientOrganizationAdminsError";
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationMemberNotFoundError";
    readonly __typename: "OrganizationMemberNotFoundError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type DemoteMemberModalMutation = {
  response: DemoteMemberModalMutation$data;
  variables: DemoteMemberModalMutation$variables;
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
    "name": "DemoteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "demoteOrganizationMember",
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MemberFragment"
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
            "type": "DemoteOrganizationMemberSuccess",
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
    "name": "DemoteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "demoteOrganizationMember",
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
                    "kind": "ScalarField",
                    "name": "role",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createdAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
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
                "filters": null,
                "handle": "appendEdge",
                "key": "",
                "kind": "LinkedHandle",
                "name": "organizationMemberEdge",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "connections"
                  }
                ]
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
            "type": "DemoteOrganizationMemberSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bd4361ef79da16d0af42088429bba799",
    "id": null,
    "metadata": {},
    "name": "DemoteMemberModalMutation",
    "operationKind": "mutation",
    "text": "mutation DemoteMemberModalMutation(\n  $accountId: ID!\n  $organizationId: ID!\n) {\n  demoteOrganizationMember(accountId: $accountId, organizationId: $organizationId) {\n    __typename\n    ... on DemoteOrganizationMemberSuccess {\n      organizationMemberEdge {\n        ...MemberFragment\n      }\n      organization {\n        id\n        ...MemberControlsOrganizationFragment\n      }\n    }\n    ... on OrganizationNotFoundError {\n      __typename\n    }\n    ... on OrganizationMemberNotFoundError {\n      __typename\n    }\n    ... on InsufficientOrganizationAdminsError {\n      __typename\n    }\n    ... on OrganizationAuthorizationError {\n      __typename\n    }\n  }\n}\n\nfragment DemoteMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment DemoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment MemberControlsFragment on OrganizationMemberEdge {\n  role\n  node {\n    fullName\n    id\n  }\n  ...RemoveMemberModalFragment\n  ...DemoteMemberModalFragment\n  ...PromoteMemberModalFragment\n}\n\nfragment MemberControlsOrganizationFragment on Organization {\n  ...RemoveMemberModalOrganizationFragment\n  ...DemoteMemberModalOrganizationFragment\n  ...PromoteMemberModalOrganizationFragment\n  adminCount\n}\n\nfragment MemberFragment on OrganizationMemberEdge {\n  role\n  createdAt\n  node {\n    fullName\n    avatarUrl\n    id\n  }\n  ...MemberControlsFragment\n}\n\nfragment PromoteMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment PromoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment RemoveMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment RemoveMemberModalOrganizationFragment on Organization {\n  id\n}\n"
  }
};
})();

(node as any).hash = "5b2a6872ce7469f6ac6b7dbdb4d91c35";

export default node;
