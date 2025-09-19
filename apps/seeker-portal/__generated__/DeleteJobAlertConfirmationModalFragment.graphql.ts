/**
 * @generated SignedSource<<e08eed2ea88162421713bceb6337ce2c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteJobAlertConfirmationModalFragment$data = {
  readonly filters: {
    readonly searchTerm: string;
  };
  readonly id: string;
  readonly " $fragmentType": "DeleteJobAlertConfirmationModalFragment";
};
export type DeleteJobAlertConfirmationModalFragment$key = {
  readonly " $data"?: DeleteJobAlertConfirmationModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteJobAlertConfirmationModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteJobAlertConfirmationModalFragment",
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
      "concreteType": "AlertFilters",
      "kind": "LinkedField",
      "name": "filters",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "searchTerm",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobAlert",
  "abstractKey": null
};

(node as any).hash = "04afe4f302404d04db01b84a37b79b55";

export default node;
