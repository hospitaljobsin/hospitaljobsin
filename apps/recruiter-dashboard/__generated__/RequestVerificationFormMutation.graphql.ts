/**
 * @generated SignedSource<<afada61642a39f4e28f7b8cbde9c9a16>>
 * @relayHash ea637c4d94715001de71d53b6c6f9887
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ea637c4d94715001de71d53b6c6f9887

import type { ConcreteRequest } from 'relay-runtime';
export type AddressProof = "BANK_STATEMENT" | "OTHER" | "RENTAL_AGREEMENT" | "UTILITY_BILL" | "%future added value";
export type BusinessProof = "CLINIC_REGISTRATION" | "GST_CERTIFICATE" | "MEDICAL_COUNCIL_REGISTRATION" | "MSME_REGISTRATION" | "OTHER" | "SHOP_LICENSE" | "%future added value";
export type AddressInput = {
  addressLocality?: string | null | undefined;
  addressRegion?: string | null | undefined;
  country?: string | null | undefined;
  postalCode?: string | null | undefined;
  streetAddress?: string | null | undefined;
};
export type RequestVerificationFormMutation$variables = {
  address: AddressInput;
  addressProofType: AddressProof;
  addressProofUrl: string;
  businessProofType: BusinessProof;
  businessProofUrl: string;
  contactEmail: string;
  organizationId: string;
  phoneNumber: string;
  registeredOrganizationName: string;
};
export type RequestVerificationFormMutation$data = {
  readonly requestOrganizationVerification: {
    readonly __typename: "InvalidPhoneNumberError";
    readonly message: string;
  } | {
    readonly __typename: "Organization";
    readonly id: string;
    readonly verificationStatus: {
      readonly __typename: string;
      readonly message?: string;
      readonly rejectedAt?: any;
      readonly requestedAt?: any;
      readonly verified: {
        readonly verifiedAt: any;
      } | null | undefined;
    };
  } | {
    readonly __typename: "OrganizationAlreadyVerifiedError";
    readonly message: string;
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly message: string;
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly message: string;
  } | {
    readonly __typename: "OrganizationVerificationRequestAlreadyExistsError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type RequestVerificationFormMutation = {
  response: RequestVerificationFormMutation$data;
  variables: RequestVerificationFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "address"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "addressProofType"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "addressProofUrl"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "businessProofType"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "businessProofUrl"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "contactEmail"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "phoneNumber"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "registeredOrganizationName"
},
v9 = [
  {
    "kind": "Variable",
    "name": "address",
    "variableName": "address"
  },
  {
    "kind": "Variable",
    "name": "addressProofType",
    "variableName": "addressProofType"
  },
  {
    "kind": "Variable",
    "name": "addressProofUrl",
    "variableName": "addressProofUrl"
  },
  {
    "kind": "Variable",
    "name": "businessProofType",
    "variableName": "businessProofType"
  },
  {
    "kind": "Variable",
    "name": "businessProofUrl",
    "variableName": "businessProofUrl"
  },
  {
    "kind": "Variable",
    "name": "contactEmail",
    "variableName": "contactEmail"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  },
  {
    "kind": "Variable",
    "name": "phoneNumber",
    "variableName": "phoneNumber"
  },
  {
    "kind": "Variable",
    "name": "registeredOrganizationName",
    "variableName": "registeredOrganizationName"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "verifiedAt",
      "storageKey": null
    }
  ],
  "type": "Verified",
  "abstractKey": null
},
v13 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "rejectedAt",
      "storageKey": null
    }
  ],
  "type": "Rejected",
  "abstractKey": null
},
v14 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "requestedAt",
      "storageKey": null
    }
  ],
  "type": "Pending",
  "abstractKey": null
},
v15 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v16 = {
  "kind": "InlineFragment",
  "selections": (v15/*: any*/),
  "type": "NotRequested",
  "abstractKey": null
},
v17 = {
  "kind": "InlineFragment",
  "selections": (v15/*: any*/),
  "type": "OrganizationNotFoundError",
  "abstractKey": null
},
v18 = {
  "kind": "InlineFragment",
  "selections": (v15/*: any*/),
  "type": "OrganizationAuthorizationError",
  "abstractKey": null
},
v19 = {
  "kind": "InlineFragment",
  "selections": (v15/*: any*/),
  "type": "OrganizationAlreadyVerifiedError",
  "abstractKey": null
},
v20 = {
  "kind": "InlineFragment",
  "selections": (v15/*: any*/),
  "type": "OrganizationVerificationRequestAlreadyExistsError",
  "abstractKey": null
},
v21 = {
  "kind": "InlineFragment",
  "selections": (v15/*: any*/),
  "type": "InvalidPhoneNumberError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RequestVerificationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestOrganizationVerification",
        "plural": false,
        "selections": [
          (v10/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "verificationStatus",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  {
                    "fragment": (v12/*: any*/),
                    "kind": "AliasedInlineFragmentSpread",
                    "name": "verified"
                  },
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v16/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/)
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
      (v6/*: any*/),
      (v8/*: any*/),
      (v5/*: any*/),
      (v7/*: any*/),
      (v0/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "RequestVerificationFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "requestOrganizationVerification",
        "plural": false,
        "selections": [
          (v10/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "verificationStatus",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v16/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v11/*: any*/)
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
    "id": "ea637c4d94715001de71d53b6c6f9887",
    "metadata": {},
    "name": "RequestVerificationFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "1910dcda213a66ccb75fdd7aa83841f2";

export default node;
