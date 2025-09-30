/**
 * @generated SignedSource<<3ac4cf48ae78bd7d5958537f2ec02c6d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileSnapshotViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AboutMeFragment" | "ApplicantFieldsFragment" | "CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LicensesFragment" | "PersonalDetailsFragment" | "WorkExperienceFragment">;
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
      "name": "PersonalDetailsFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkExperienceFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ApplicantFieldsFragment"
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "1b24645748d2e9f07b202550f8c0e715";

export default node;
