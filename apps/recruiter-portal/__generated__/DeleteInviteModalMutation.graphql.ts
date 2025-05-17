/**
 * @generated SignedSource<<d0f34c86c48b44fac19908af9d1b661a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteInviteModalMutation$variables = {
  connections: ReadonlyArray<string>;
  inviteId: string;
  organizationId: string;
};
export type DeleteInviteModalMutation$data = {
  readonly deleteOrganizationInvite: {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationInviteEdge";
    readonly node: {
      readonly id: string;
    };
  } | {
    readonly __typename: "OrganizationInviteNotFoundError";
    readonly __typename: "OrganizationInviteNotFoundError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type DeleteInviteModalMutation = {
  response: DeleteInviteModalMutation$data;
  variables: DeleteInviteModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inviteId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "inviteId",
    "variableName": "inviteId"
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
    "name": "DeleteInviteModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteOrganizationInvite",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationInvite",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "OrganizationInviteEdge",
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
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "DeleteInviteModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteOrganizationInvite",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationInvite",
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
            "type": "OrganizationInviteEdge",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a981b53a057540857d156f2338a425f0",
    "id": null,
    "metadata": {},
    "name": "DeleteInviteModalMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteInviteModalMutation(\n  $inviteId: ID!\n  $organizationId: ID!\n) {\n  deleteOrganizationInvite(inviteId: $inviteId, organizationId: $organizationId) {\n    __typename\n    ... on OrganizationInviteEdge {\n      node {\n        id\n      }\n    }\n    ... on OrganizationNotFoundError {\n      __typename\n    }\n    ... on OrganizationInviteNotFoundError {\n      __typename\n    }\n    ... on OrganizationAuthorizationError {\n      __typename\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "eeddd81ed8d1d66c335a4d316ef963e7";

export default node;
