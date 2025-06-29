/**
 * @generated SignedSource<<2f5f98c16808fd410db736dea720d8c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileSnapshotViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AboutMeFragment" | "CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LicensesFragment" | "LocationPreferencesFragment" | "PersonalDetailsFragment" | "WorkExperienceFragment">;
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
      "name": "AboutMeFragment"
    },
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

(node as any).hash = "d56ac506c94664ec235eeaee5d80f003";

export default node;
