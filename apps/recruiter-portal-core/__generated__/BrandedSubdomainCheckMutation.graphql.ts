/**
 * @generated SignedSource<<4204a799771ab58bac161d8ae6cea996>>
 * @relayHash 7f259f15ee97dfd0593a25edaeb57796
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7f259f15ee97dfd0593a25edaeb57796

import type { ConcreteRequest } from 'relay-runtime';
export type BrandedSubdomainCheckMutation$variables = {
  slug: string;
};
export type BrandedSubdomainCheckMutation$data = {
  readonly checkOrganizationSlugAvailability: {
    readonly isAvailable: boolean;
  };
};
export type BrandedSubdomainCheckMutation = {
  response: BrandedSubdomainCheckMutation$data;
  variables: BrandedSubdomainCheckMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "slug",
        "variableName": "slug"
      }
    ],
    "concreteType": "CheckOrganizationSlugAvailabilityPayload",
    "kind": "LinkedField",
    "name": "checkOrganizationSlugAvailability",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isAvailable",
        "storageKey": null
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
    "name": "BrandedSubdomainCheckMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BrandedSubdomainCheckMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "7f259f15ee97dfd0593a25edaeb57796",
    "metadata": {},
    "name": "BrandedSubdomainCheckMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d710a86c3a51f9a1360c4cfb205a3b4f";

export default node;
