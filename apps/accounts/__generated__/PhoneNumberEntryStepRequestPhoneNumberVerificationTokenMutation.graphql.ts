/**
 * @generated SignedSource<<4f1e9af5f17757687d6e778345a65cb1>>
 * @relayHash dec0c4525faccd5bc1c52a5ad7ceab3b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID dec0c4525faccd5bc1c52a5ad7ceab3b

import type { ConcreteRequest } from 'relay-runtime';
export type PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation$variables = {
  phoneNumber: string;
};
export type PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation$data = {
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
    readonly __typename: "RequestPhoneNumberVerificationTokenSuccess";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation = {
  response: PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation$data;
  variables: PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation$variables;
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
    "name": "PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "dec0c4525faccd5bc1c52a5ad7ceab3b",
    "metadata": {},
    "name": "PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "fb8b1b3541369b620ff052964ab4d93e";

export default node;
