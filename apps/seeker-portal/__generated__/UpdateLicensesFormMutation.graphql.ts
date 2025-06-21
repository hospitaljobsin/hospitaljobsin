/**
 * @generated SignedSource<<c08ed56718347de35bb5a3b30acca143>>
 * @relayHash d0ef1a743f88611b5ec6c944a701b0ab
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d0ef1a743f88611b5ec6c944a701b0ab

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LicenseInput = {
  expiresAt?: any | null | undefined;
  issuedAt: any;
  issuer: string;
  licenseNumber: string;
  name: string;
};
export type UpdateLicensesFormMutation$variables = {
  licenses: ReadonlyArray<LicenseInput>;
};
export type UpdateLicensesFormMutation$data = {
  readonly updateProfileLicenses: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateLicensesFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"IncompleteProfileBannerFragment">;
  };
};
export type UpdateLicensesFormMutation = {
  response: UpdateLicensesFormMutation$data;
  variables: UpdateLicensesFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "licenses"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "licenses",
    "variableName": "licenses"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateLicensesFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileLicenses",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "IncompleteProfileBannerFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateLicensesFormFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          }
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
    "name": "UpdateLicensesFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileLicenses",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isComplete",
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "License",
                    "kind": "LinkedField",
                    "name": "licenses",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "issuer",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "licenseNumber",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "issuedAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expiresAt",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
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
    "id": "d0ef1a743f88611b5ec6c944a701b0ab",
    "metadata": {},
    "name": "UpdateLicensesFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "476d817ebfb3d0fcd92c5f7409ca5497";

export default node;
