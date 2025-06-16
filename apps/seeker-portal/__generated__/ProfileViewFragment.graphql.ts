/**
 * @generated SignedSource<<31c421940e736914b0e828a3d0052512>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileViewFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly profile: {
      readonly " $fragmentSpreads": FragmentRefs<"CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LocationPreferencesFragment" | "PersonalDetailsFragment" | "UpdateCertificationsFormFragment" | "UpdateEducationFormFragment" | "UpdateLanguagesFormFragment" | "UpdateLocationPreferencesFormFragment" | "UpdatePersonalDetailsFormFragment" | "UpdateWorkExperienceFormFragment" | "WorkExperienceFragment">;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "ProfileViewFragment";
};
export type ProfileViewFragment$key = {
  readonly " $data"?: ProfileViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileViewFragment",
  "selections": [
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
          "kind": "InlineFragment",
          "selections": [
            {
              "kind": "RequiredField",
              "field": {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdatePersonalDetailsFormFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PersonalDetailsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LanguagesFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateLanguagesFormFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateLocationPreferencesFormFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationPreferencesFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateEducationFormFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "EducationFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateWorkExperienceFormFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkExperienceFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "CertificationsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateCertificationsFormFragment"
                  }
                ],
                "storageKey": null
              },
              "action": "THROW"
            }
          ],
          "type": "Account",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "f9093b56e6a53e379a7f19584f19dac7";

export default node;
