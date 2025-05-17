/**
 * @generated SignedSource<<bb3091069122640de33e66b2c4daf847>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PromoteMemberModalMutation$variables = {
  accountId: string;
  organizationId: string;
};
export type PromoteMemberModalMutation$data = {
  readonly promoteOrganizationMember: {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationMemberNotFoundError";
    readonly __typename: "OrganizationMemberNotFoundError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    readonly __typename: "PromoteOrganizationMemberSuccess";
    readonly organization: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
    };
    readonly organizationMemberEdge: {
      readonly " $fragmentSpreads": FragmentRefs<"MemberFragment">;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PromoteMemberModalMutation = {
  response: PromoteMemberModalMutation$data;
  variables: PromoteMemberModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organizationId"
  }
],
v1 = [
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PromoteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "promoteOrganizationMember",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                  (v3/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MemberControlsOrganizationFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "PromoteOrganizationMemberSuccess",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PromoteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "promoteOrganizationMember",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                      (v3/*: any*/)
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
                  (v3/*: any*/),
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
            "type": "PromoteOrganizationMemberSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ec9560f6105533f08454b7b0222f4903",
    "id": null,
    "metadata": {},
    "name": "PromoteMemberModalMutation",
    "operationKind": "mutation",
    "text": "mutation PromoteMemberModalMutation(\n  $accountId: ID!\n  $organizationId: ID!\n) {\n  promoteOrganizationMember(accountId: $accountId, organizationId: $organizationId) {\n    __typename\n    ... on PromoteOrganizationMemberSuccess {\n      organizationMemberEdge {\n        ...MemberFragment\n      }\n      organization {\n        id\n        ...MemberControlsOrganizationFragment\n      }\n    }\n    ... on OrganizationNotFoundError {\n      __typename\n    }\n    ... on OrganizationMemberNotFoundError {\n      __typename\n    }\n    ... on OrganizationAuthorizationError {\n      __typename\n    }\n  }\n}\n\nfragment DemoteMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment DemoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment MemberControlsFragment on OrganizationMemberEdge {\n  role\n  node {\n    fullName\n    id\n  }\n  ...RemoveMemberModalFragment\n  ...DemoteMemberModalFragment\n  ...PromoteMemberModalFragment\n}\n\nfragment MemberControlsOrganizationFragment on Organization {\n  ...RemoveMemberModalOrganizationFragment\n  ...DemoteMemberModalOrganizationFragment\n  ...PromoteMemberModalOrganizationFragment\n  adminCount\n}\n\nfragment MemberFragment on OrganizationMemberEdge {\n  role\n  createdAt\n  node {\n    fullName\n    avatarUrl\n    id\n  }\n  ...MemberControlsFragment\n}\n\nfragment PromoteMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment PromoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment RemoveMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment RemoveMemberModalOrganizationFragment on Organization {\n  id\n}\n"
  }
};
})();

(node as any).hash = "8aa9416c2b490545c4bf40883f630616";

export default node;
