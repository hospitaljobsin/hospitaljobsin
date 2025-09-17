/**
 * @generated SignedSource<<34c2c9a2b3def96f8b2d1bb7fdef492e>>
 * @relayHash 9856e60218221dde6771b1aa2e0ea27d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9856e60218221dde6771b1aa2e0ea27d

import type { ConcreteRequest } from 'relay-runtime';
export type DisableWhatsappJobAlertsModalMutation$variables = {
  enabled: boolean;
};
export type DisableWhatsappJobAlertsModalMutation$data = {
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
export type DisableWhatsappJobAlertsModalMutation = {
  response: DisableWhatsappJobAlertsModalMutation$data;
  variables: DisableWhatsappJobAlertsModalMutation$variables;
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
    "name": "DisableWhatsappJobAlertsModalMutation",
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
    "name": "DisableWhatsappJobAlertsModalMutation",
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
    "id": "9856e60218221dde6771b1aa2e0ea27d",
    "metadata": {},
    "name": "DisableWhatsappJobAlertsModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "f8f3252b105a05a1ed8a9863e3155848";

export default node;
