/**
 * @generated SignedSource<<6aa88db6aaf0acb202cb2278ad0f27c4>>
 * @relayHash 2646178336b2fad1b2cad9cbcae6efdb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2646178336b2fad1b2cad9cbcae6efdb

import type { ConcreteRequest } from 'relay-runtime';
export type EmployeeBenefitsListReorderMutation$variables = {
  benefitIds: ReadonlyArray<string>;
  organizationId: string;
};
export type EmployeeBenefitsListReorderMutation$data = {
  readonly reorderEmployeeBenefits: {
    readonly __typename: "ReorderEmployeeBenefitsSuccess";
    readonly employeeBenefits: ReadonlyArray<{
      readonly id: string;
      readonly order: number;
    }>;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type EmployeeBenefitsListReorderMutation = {
  response: EmployeeBenefitsListReorderMutation$data;
  variables: EmployeeBenefitsListReorderMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "benefitIds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "benefitIds",
        "variableName": "benefitIds"
      },
      {
        "kind": "Variable",
        "name": "organizationId",
        "variableName": "organizationId"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "reorderEmployeeBenefits",
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
            "concreteType": "EmployeeBenefit",
            "kind": "LinkedField",
            "name": "employeeBenefits",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "order",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "type": "ReorderEmployeeBenefitsSuccess",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EmployeeBenefitsListReorderMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "EmployeeBenefitsListReorderMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "id": "2646178336b2fad1b2cad9cbcae6efdb",
    "metadata": {},
    "name": "EmployeeBenefitsListReorderMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "2adf10cf0e103cfdc5aec47dd0e93362";

export default node;
