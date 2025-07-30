/**
 * @generated SignedSource<<f1c32e85e8ea195561bb9c47f960a2ee>>
 * @relayHash cbf031ac5a490b763073152452507bf1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID cbf031ac5a490b763073152452507bf1

import type { ConcreteRequest } from 'relay-runtime';
export type VerificationTokenStepUpdateAccountPhoneNumberMutation$variables = {
  phoneNumber: string;
  phoneNumberVerificationToken: string;
};
export type VerificationTokenStepUpdateAccountPhoneNumberMutation$data = {
  readonly updateAccountPhoneNumber: {
    readonly __typename: "Account";
    readonly __typename: "Account";
    readonly id: string;
    readonly phoneNumber: string | null | undefined;
  } | {
    readonly __typename: "InvalidPhoneNumberError";
    readonly message: string;
  } | {
    readonly __typename: "InvalidPhoneNumberVerificationTokenError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type VerificationTokenStepUpdateAccountPhoneNumberMutation = {
  response: VerificationTokenStepUpdateAccountPhoneNumberMutation$data;
  variables: VerificationTokenStepUpdateAccountPhoneNumberMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "phoneNumber"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "phoneNumberVerificationToken"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "phoneNumber",
    "variableName": "phoneNumber"
  },
  {
    "kind": "Variable",
    "name": "phoneNumberVerificationToken",
    "variableName": "phoneNumberVerificationToken"
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
      "name": "phoneNumber",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidPhoneNumberVerificationTokenError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidPhoneNumberError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VerificationTokenStepUpdateAccountPhoneNumberMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccountPhoneNumber",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
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
    "name": "VerificationTokenStepUpdateAccountPhoneNumberMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccountPhoneNumber",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
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
    "id": "cbf031ac5a490b763073152452507bf1",
    "metadata": {},
    "name": "VerificationTokenStepUpdateAccountPhoneNumberMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "8a71fc07f5a0de3e1a47980d1d15bf37";

export default node;
