/**
 * @generated SignedSource<<4724b6a980e4ee9624e479a460346cd4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplicationFlowJobFragment$data = {
  readonly applicationForm: {
    readonly fields: ReadonlyArray<{
      readonly __typename: "ApplicationField";
    }>;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"CompleteProfileDrawerJobFragment">;
  readonly " $fragmentType": "JobApplicationFlowJobFragment";
};
export type JobApplicationFlowJobFragment$key = {
  readonly " $data"?: JobApplicationFlowJobFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplicationFlowJobFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobApplicationFlowJobFragment",
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
      "concreteType": "JobApplicationForm",
      "kind": "LinkedField",
      "name": "applicationForm",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ApplicationField",
          "kind": "LinkedField",
          "name": "fields",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__typename",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CompleteProfileDrawerJobFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "7c24436c1892e71d7c6d2fbe04e1c9c2";

export default node;
