/**
 * @generated SignedSource<<6c7f91da35ca1459c0e6c5ffb90da54c>>
 * @relayHash c77e8dbe81398bc7bff503f56424b5f5
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c77e8dbe81398bc7bff503f56424b5f5

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
    readonly cooldownRemainingSeconds: number;
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
    "id": "c77e8dbe81398bc7bff503f56424b5f5",
    "metadata": {},
    "name": "PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "49f929ae4fa1a0d5172b130501a8eb45";

export default node;
