/**
 * @generated SignedSource<<828724287f4ab3f27a495f0d20765009>>
 * @relayHash 6cea85fcfcf0f4a44610ce9297c6a879
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6cea85fcfcf0f4a44610ce9297c6a879

import type { ConcreteRequest } from 'relay-runtime';
export type AddressProof = "BANK_STATEMENT" | "OTHER" | "RENTAL_AGREEMENT" | "UTILITY_BILL" | "%future added value";
export type BusinessProof = "CLINIC_REGISTRATION" | "GST_CERTIFICATE" | "MEDICAL_COUNCIL_REGISTRATION" | "MSME_REGISTRATION" | "OTHER" | "SHOP_LICENSE" | "%future added value";
export type VerificationStatus = "NOT_REQUESTED" | "PENDING" | "REJECTED" | "VERIFIED" | "%future added value";
export type AddressInput = {
  city?: string | null | undefined;
  country?: string | null | undefined;
  line1?: string | null | undefined;
  line2?: string | null | undefined;
  pincode?: string | null | undefined;
  state?: string | null | undefined;
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
    readonly verificationStatus: VerificationStatus;
    readonly verifiedAt: any | null | undefined;
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
    (v11/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "verificationStatus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "verifiedAt",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
},
v13 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v14 = {
  "kind": "InlineFragment",
  "selections": (v13/*: any*/),
  "type": "OrganizationNotFoundError",
  "abstractKey": null
},
v15 = {
  "kind": "InlineFragment",
  "selections": (v13/*: any*/),
  "type": "OrganizationAuthorizationError",
  "abstractKey": null
},
v16 = {
  "kind": "InlineFragment",
  "selections": (v13/*: any*/),
  "type": "OrganizationAlreadyVerifiedError",
  "abstractKey": null
},
v17 = {
  "kind": "InlineFragment",
  "selections": (v13/*: any*/),
  "type": "OrganizationVerificationRequestAlreadyExistsError",
  "abstractKey": null
},
v18 = {
  "kind": "InlineFragment",
  "selections": (v13/*: any*/),
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
          (v12/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/)
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
          (v12/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
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
    "id": "6cea85fcfcf0f4a44610ce9297c6a879",
    "metadata": {},
    "name": "RequestVerificationFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "34ffc4239cd27812ba116469cadbe897";

export default node;
