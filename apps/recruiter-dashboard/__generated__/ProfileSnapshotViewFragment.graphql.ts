/**
 * @generated SignedSource<<a69dcfd437553f7dbd1ac1b119316f80>>
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
  "type": "ProfileSnapshot",
  "abstractKey": null
};

(node as any).hash = "0120e4b2a6ca627022cd47c21d9583bc";

export default node;
