/**
 * @generated SignedSource<<d8b8a6d57da61b640417d2322f1bfd31>>
 * @relayHash 924c909ea5e2f27d6b53e87d4bc065cc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 924c909ea5e2f27d6b53e87d4bc065cc

import type { ConcreteRequest } from 'relay-runtime';
export type DeleteOrganizationModalMutation$variables = {
  organizationId: string;
};
export type DeleteOrganizationModalMutation$data = {
  readonly deleteOrganization: {
    readonly __typename: "Organization";
    readonly id: string;
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type DeleteOrganizationModalMutation = {
  response: DeleteOrganizationModalMutation$data;
  variables: DeleteOrganizationModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organizationId"
  }
],
v1 = [
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
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  }
],
v4 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "Organization",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteOrganizationModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteOrganization",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/)
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
    "name": "DeleteOrganizationModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deleteOrganization",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": (v3/*: any*/),
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "924c909ea5e2f27d6b53e87d4bc065cc",
    "metadata": {},
    "name": "DeleteOrganizationModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "52b16528d50d9c47a968698e7b84d845";

export default node;
