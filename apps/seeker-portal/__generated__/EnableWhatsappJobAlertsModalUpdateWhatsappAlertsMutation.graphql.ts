/**
 * @generated SignedSource<<4bfdb9455c628662016344aa5c14d8dc>>
 * @relayHash 6524faae6442cf1b7696dc28b119e23c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6524faae6442cf1b7696dc28b119e23c

import type { ConcreteRequest } from 'relay-runtime';
export type EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation$variables = {
  enabled: boolean;
};
export type EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation$data = {
  readonly updateAccountWhatsappJobAlerts: {
    readonly __typename: "Account";
    readonly id: string;
    readonly whatsappJobAlertsEnabled: boolean;
  } | {
    readonly __typename: "PhoneNumberMissingError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation = {
  response: EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation$data;
  variables: EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "enabled"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "enabled",
    "variableName": "enabled"
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
},
v4 = {
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "whatsappJobAlertsEnabled",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
},
v5 = {
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
  "type": "PhoneNumberMissingError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccountWhatsappJobAlerts",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/)
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
    "name": "EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccountWhatsappJobAlerts",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
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
    "id": "6524faae6442cf1b7696dc28b119e23c",
    "metadata": {},
    "name": "EnableWhatsappJobAlertsModalUpdateWhatsappAlertsMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "3a2cde17c3bee8d7f2738dd14dba0c93";

export default node;
