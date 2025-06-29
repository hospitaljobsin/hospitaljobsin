/**
 * @generated SignedSource<<12121f2dd33200566d6ccf1772442bba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileSnapshotViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LicensesFragment" | "LocationPreferencesFragment" | "PersonalDetailsFragment" | "WorkExperienceFragment">;
  readonly " $fragmentType": "ProfileSnapshotViewFragment";
};
export type ProfileSnapshotViewFragment$key = {
  readonly " $data"?: ProfileSnapshotViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileSnapshotViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileSnapshotViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CertificationsFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EducationFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LanguagesFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LicensesFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LocationPreferencesFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PersonalDetailsFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkExperienceFragment"
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "4815e0c6899362c43a0e93da1bd439bc";

export default node;
