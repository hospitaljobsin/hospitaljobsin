/**
 * @generated SignedSource<<1fa44160e2f31566bdaca667c0179377>>
 * @relayHash 050f30b2d06bd2cfa3b236abf529e734
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 050f30b2d06bd2cfa3b236abf529e734

import type { ConcreteRequest } from 'relay-runtime';
export type EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation$variables = {
  phoneNumber: string;
};
export type EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation$data = {
  readonly requestPhoneNumberVerificationToken: {
    readonly __typename: "InvalidPhoneNumberError";
    readonly message: string;
  } | {
    readonly __typename: "PhoneNumberAlreadyExistsError";
    readonly message: string;
  } | {
    readonly __typename: "PhoneNumberVerificationTokenCooldownError";
    readonly message: string;
    readonly remainingSeconds: number;
  } | {
    readonly __typename: "RequestPhoneNumberVerificationTokenSuccess";
    readonly cooldownRemainingSeconds: number;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation = {
  response: EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation$data;
  variables: EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "phoneNumber"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "phoneNumber",
        "variableName": "phoneNumber"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "requestPhoneNumberVerificationToken",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cooldownRemainingSeconds",
            "storageKey": null
          }
        ],
        "type": "RequestPhoneNumberVerificationTokenSuccess",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v2/*: any*/),
        "type": "InvalidPhoneNumberError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v2/*: any*/),
        "type": "PhoneNumberAlreadyExistsError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "remainingSeconds",
            "storageKey": null
          }
        ],
        "type": "PhoneNumberVerificationTokenCooldownError",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "050f30b2d06bd2cfa3b236abf529e734",
    "metadata": {},
    "name": "EnableWhatsappJobAlertsModalRequestPhoneVerificationMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d9a19ef47ed75c2dc713894fdddaf6f5";

export default node;
