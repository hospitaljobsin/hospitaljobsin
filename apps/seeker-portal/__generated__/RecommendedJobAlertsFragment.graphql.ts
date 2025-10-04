/**
 * @generated SignedSource<<6117ec2a172c649e3d180472ab9a4968>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type RecommendedJobAlertsFragment$data = {
  readonly recommendedJobAlerts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly filters: {
          readonly jobType: ReadonlyArray<JobTypeFilter> | null | undefined;
          readonly location: string | null | undefined;
          readonly maxExperience: number | null | undefined;
          readonly maxSalary: number | null | undefined;
          readonly minExperience: number | null | undefined;
          readonly minSalary: number | null | undefined;
          readonly searchTerm: string;
          readonly workMode: ReadonlyArray<WorkMode> | null | undefined;
        };
        readonly id: string;
      };
    }>;
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "RecommendedJobAlertsFragment";
};
export type RecommendedJobAlertsFragment$key = {
  readonly " $data"?: RecommendedJobAlertsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecommendedJobAlertsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecommendedJobAlertsFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "RecommendedJobAlertConnection",
      "kind": "LinkedField",
      "name": "recommendedJobAlerts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "RecommendedJobAlertEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "RecommendedJobAlert",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
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
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "location",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "minExperience",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "maxExperience",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "minSalary",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "maxSalary",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "jobType",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "workMode",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        }
      ],
      "storageKey": "recommendedJobAlerts(first:10)"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "1b74bc5420781a9cd71fc9993d3d0312";

export default node;
