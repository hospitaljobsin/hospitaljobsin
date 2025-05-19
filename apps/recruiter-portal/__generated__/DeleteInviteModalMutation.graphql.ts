/**
 * @generated SignedSource<<0eaa701481da29642a48a92cdce5ec9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
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
    "cacheID": "baf5712eaebddd74661e2366a4d1ea23",
    "id": null,
    "metadata": {},
    "name": "DeleteInviteModalMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteInviteModalMutation($inviteId:ID!,$organizationId:ID!){deleteOrganizationInvite(inviteId:$inviteId,organizationId:$organizationId){__typename,...on OrganizationInviteEdge{node{id}},...on OrganizationNotFoundError{__typename},...on OrganizationInviteNotFoundError{__typename},...on OrganizationAuthorizationError{__typename}}}"
  }
};
})();

(node as any).hash = "eeddd81ed8d1d66c335a4d316ef963e7";

export default node;
