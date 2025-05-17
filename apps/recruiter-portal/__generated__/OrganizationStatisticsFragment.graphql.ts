/**
 * @generated SignedSource<<06a9cbba9f5294ddf5728a31c2f40229>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationStatisticsFragment$data = {
  readonly totalViewCount: number;
  readonly totalViewMetricPoints: ReadonlyArray<{
    readonly count: number;
    readonly timestamp: any;
  }>;
  readonly " $fragmentType": "OrganizationStatisticsFragment";
};
export type OrganizationStatisticsFragment$key = {
  readonly " $data"?: OrganizationStatisticsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationStatisticsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationStatisticsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalViewCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "JobMetricPoint",
      "kind": "LinkedField",
      "name": "totalViewMetricPoints",
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
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "9409c96983c4a897abd4a868a37b0b11";

export default node;
