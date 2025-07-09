/**
 * @generated SignedSource<<c3702b238bfc263cccee27a6a9ec241b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileSnapshotViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AboutMeFragment" | "ApplicantFieldsFragment" | "CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LicensesFragment" | "LocationPreferencesFragment" | "PersonalDetailsFragment" | "WorkExperienceFragment">;
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

(node as any).hash = "5edc5f27fb41bf3fc6a91807675bb7c8";

export default node;
