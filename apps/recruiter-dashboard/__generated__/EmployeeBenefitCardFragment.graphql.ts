/**
 * @generated SignedSource<<44cab06bf4e06d64d90001d9d6dc891a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EmployeeBenefitCardFragment$data = {
  readonly description: string;
  readonly id: string;
  readonly posterImageUrl: string | null | undefined;
  readonly title: string;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteEmployeeBenefitModalFragment" | "EditEmployeeBenefitModalFragment">;
  readonly " $fragmentType": "EmployeeBenefitCardFragment";
};
export type EmployeeBenefitCardFragment$key = {
  readonly " $data"?: EmployeeBenefitCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeBenefitCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeBenefitCardFragment",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EditEmployeeBenefitModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteEmployeeBenefitModalFragment"
    }
  ],
  "type": "EmployeeBenefit",
  "abstractKey": null
};

(node as any).hash = "a374d37e67146b1d17d81ea15fa1f8f9";

export default node;
