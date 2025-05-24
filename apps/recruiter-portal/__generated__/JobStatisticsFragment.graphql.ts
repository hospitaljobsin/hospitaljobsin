/**
 * @generated SignedSource<<ebb951396b5beb24d5f6cc4809c8052c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobStatisticsFragment$data = {
  readonly viewCount: number;
  readonly viewMetricPoints: ReadonlyArray<{
    readonly count: number;
    readonly timestamp: any;
  }>;
  readonly " $fragmentType": "JobStatisticsFragment";
};
export type JobStatisticsFragment$key = {
  readonly " $data"?: JobStatisticsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobStatisticsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobStatisticsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "viewCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "JobMetricPoint",
      "kind": "LinkedField",
      "name": "viewMetricPoints",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "timestamp",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "count",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "27dad7dd5d8bf4ef1b360f4acefcef8a";

export default node;
