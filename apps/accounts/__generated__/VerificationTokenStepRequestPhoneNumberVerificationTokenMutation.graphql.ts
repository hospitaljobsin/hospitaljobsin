/**
 * @generated SignedSource<<d61cb2b66687596e31e5ed89df32e693>>
 * @relayHash c6762fd47950f6f5a46a36079ac3e3d3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c6762fd47950f6f5a46a36079ac3e3d3

import type { ConcreteRequest } from 'relay-runtime';
export type VerificationTokenStepRequestPhoneNumberVerificationTokenMutation$variables = {
  phoneNumber: string;
};
export type VerificationTokenStepRequestPhoneNumberVerificationTokenMutation$data = {
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
export type VerificationTokenStepRequestPhoneNumberVerificationTokenMutation = {
  response: VerificationTokenStepRequestPhoneNumberVerificationTokenMutation$data;
  variables: VerificationTokenStepRequestPhoneNumberVerificationTokenMutation$variables;
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
    "name": "VerificationTokenStepRequestPhoneNumberVerificationTokenMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VerificationTokenStepRequestPhoneNumberVerificationTokenMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "id": "c6762fd47950f6f5a46a36079ac3e3d3",
    "metadata": {},
    "name": "VerificationTokenStepRequestPhoneNumberVerificationTokenMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "e46d12408e2c05308ad3c986e59c120e";

export default node;
