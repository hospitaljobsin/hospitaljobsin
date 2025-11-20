/**
 * @generated SignedSource<<2d566cb556e2a6e50397117b664111d9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CreateEmployeeBenefitModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "CreateEmployeeBenefitModalFragment";
};
export type CreateEmployeeBenefitModalFragment$key = {
  readonly " $data"?: CreateEmployeeBenefitModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CreateEmployeeBenefitModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreateEmployeeBenefitModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "241cb6cc293beaa9f8e8eadfad8bb742";

export default node;
