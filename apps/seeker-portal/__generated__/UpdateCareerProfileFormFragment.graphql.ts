/**
 * @generated SignedSource<<14a4e844d6173104f0e0293f77b08925>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type UpdateCareerProfileFormFragment$data = {
  readonly __typename: "Profile";
  readonly careerProfile: {
    readonly currentIndustry: string | null | undefined;
    readonly desiredJobTypes: ReadonlyArray<JobType>;
    readonly desiredWorkModes: ReadonlyArray<WorkMode>;
    readonly expectedSalary: number | null | undefined;
    readonly locationsOpenToWork: ReadonlyArray<string>;
    readonly openToRelocationAnywhere: boolean;
  } | null | undefined;
  readonly " $fragmentType": "UpdateCareerProfileFormFragment";
};
export type UpdateCareerProfileFormFragment$key = {
  readonly " $data"?: UpdateCareerProfileFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateCareerProfileFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateCareerProfileFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CareerProfile",
      "kind": "LinkedField",
      "name": "careerProfile",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "currentIndustry",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "desiredJobTypes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "desiredWorkModes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expectedSalary",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "locationsOpenToWork",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "openToRelocationAnywhere",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "c6486ee106581daac97d6431550d49fc";

export default node;
