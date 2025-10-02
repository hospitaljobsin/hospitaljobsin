/**
 * @generated SignedSource<<c720e0926b44aabdc61b3c3fe8a845c8>>
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
    readonly __typename: string;
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
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
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

(node as any).hash = "771151a8684b92c5de8df0726d30ac88";

export default node;
