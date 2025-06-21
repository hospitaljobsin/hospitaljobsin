/**
 * @generated SignedSource<<bf7a3921981c051be12cba9941b172f0>>
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
      readonly address: string;
      readonly dateOfBirth: any | null | undefined;
      readonly education: ReadonlyArray<{
        readonly __typename: "Education";
      }>;
      readonly locationsOpenToWork: ReadonlyArray<string>;
      readonly workExperience: ReadonlyArray<{
        readonly __typename: "WorkExperience";
      }>;
      readonly " $fragmentSpreads": FragmentRefs<"CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LicensesFragment" | "LocationPreferencesFragment" | "PersonalDetailsFragment" | "UpdateCertificationsFormFragment" | "UpdateEducationFormFragment" | "UpdateLanguagesFormFragment" | "UpdateLicensesFormFragment" | "UpdateLocationPreferencesFormFragment" | "UpdatePersonalDetailsFormFragment" | "UpdateWorkExperienceFormFragment" | "WorkExperienceFragment">;
    };
    readonly " $fragmentSpreads": FragmentRefs<"ProfileBannerFragment">;
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

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
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
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "ProfileBannerFragment"
            },
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
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dateOfBirth",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "address",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WorkExperience",
                    "kind": "LinkedField",
                    "name": "workExperience",
                    "plural": true,
                    "selections": (v1/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Education",
                    "kind": "LinkedField",
                    "name": "education",
                    "plural": true,
                    "selections": (v1/*: any*/),
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
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LicensesFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateLicensesFormFragment"
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
})();

(node as any).hash = "f84857f4249065624e4a0b3c827538e6";

export default node;
