/**
 * @generated SignedSource<<17c4878f6c1f3930ba2cebfd7d7cfbf6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EditEmployeeBenefitModalFragment$data = {
  readonly description: string;
  readonly id: string;
  readonly posterImageUrl: string | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "EditEmployeeBenefitModalFragment";
};
export type EditEmployeeBenefitModalFragment$key = {
  readonly " $data"?: EditEmployeeBenefitModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditEmployeeBenefitModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditEmployeeBenefitModalFragment",
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

(node as any).hash = "9a3d0b0d8fbb2c29acc7c75f8311de6e";

export default node;
