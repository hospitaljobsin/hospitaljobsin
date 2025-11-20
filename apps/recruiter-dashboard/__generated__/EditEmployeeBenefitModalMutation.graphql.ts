/**
 * @generated SignedSource<<9f53b6a36ea2a094bb7efd2bbf75f01b>>
 * @relayHash 15142648d0f767964fb8d96f4aec269b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 15142648d0f767964fb8d96f4aec269b

import type { ConcreteRequest } from 'relay-runtime';
export type EditEmployeeBenefitModalMutation$variables = {
  benefitId: string;
  description?: string | null | undefined;
  organizationId: string;
  posterImageUrl?: string | null | undefined;
  title?: string | null | undefined;
};
export type EditEmployeeBenefitModalMutation$data = {
  readonly updateEmployeeBenefit: {
    readonly __typename: "EmployeeBenefit";
    readonly description: string;
    readonly id: string;
    readonly posterImageUrl: string | null | undefined;
    readonly title: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type EditEmployeeBenefitModalMutation = {
  response: EditEmployeeBenefitModalMutation$data;
  variables: EditEmployeeBenefitModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "benefitId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "posterImageUrl"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v5 = [
  {
    "kind": "Variable",
    "name": "benefitId",
    "variableName": "benefitId"
  },
  {
    "kind": "Variable",
    "name": "description",
    "variableName": "description"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  },
  {
    "kind": "Variable",
    "name": "posterImageUrl",
    "variableName": "posterImageUrl"
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": [
    (v7/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "posterImageUrl",
      "storageKey": null
    }
  ],
  "type": "EmployeeBenefit",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "EditEmployeeBenefitModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateEmployeeBenefit",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v8/*: any*/)
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "EditEmployeeBenefitModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateEmployeeBenefit",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v7/*: any*/)
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
    "id": "15142648d0f767964fb8d96f4aec269b",
    "metadata": {},
    "name": "EditEmployeeBenefitModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "ec2edefb7f8ab56729374da45d4c283d";

export default node;
