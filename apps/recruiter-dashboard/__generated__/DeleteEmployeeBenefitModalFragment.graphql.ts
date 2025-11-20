/**
 * @generated SignedSource<<f431b21dd7a2ac487b6657738e7c51a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteEmployeeBenefitModalFragment$data = {
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "DeleteEmployeeBenefitModalFragment";
};
export type DeleteEmployeeBenefitModalFragment$key = {
  readonly " $data"?: DeleteEmployeeBenefitModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteEmployeeBenefitModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteEmployeeBenefitModalFragment",
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
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "EmployeeBenefit",
  "abstractKey": null
};

(node as any).hash = "f1d1729bb5e83424028492d5735f9cc8";

export default node;
