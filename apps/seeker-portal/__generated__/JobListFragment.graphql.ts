/**
 * @generated SignedSource<<2049d5ef09ce7e6e57936010a132377c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobListFragment$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
  };
  readonly " $fragmentSpreads": FragmentRefs<"JobListInternalFragment">;
  readonly " $fragmentType": "JobListFragment";
};
export type JobListFragment$key = {
  readonly " $data"?: JobListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobListFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Literal",
          "name": "jobType",
          "value": []
        },
        {
          "kind": "Literal",
          "name": "workMode",
          "value": []
        }
      ],
      "kind": "FragmentSpread",
      "name": "JobListInternalFragment"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "JobControlsAuthFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "9a561118d9993c83176c9317c514f383";

export default node;
