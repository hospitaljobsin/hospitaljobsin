/**
 * @generated SignedSource<<0292a4dec1e153296a9c0f07d8c10186>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CompleteProfileDrawerFragment$data = {
  readonly profile: {
    readonly address: string | null | undefined;
    readonly careerProfile: {
      readonly locationsOpenToWork: ReadonlyArray<string>;
      readonly openToRelocationAnywhere: boolean;
    } | null | undefined;
    readonly dateOfBirth: any | null | undefined;
    readonly education: ReadonlyArray<{
      readonly __typename: "Education";
    }>;
    readonly headline: string | null | undefined;
    readonly isComplete: boolean;
    readonly professionalSummary: string | null | undefined;
    readonly resumeUrl: string | null | undefined;
  };
  readonly " $fragmentSpreads": FragmentRefs<"AddressStepFragment" | "CareerProfileStepFragment" | "DateOfBirthStepFragment" | "HeadlineStepFragment">;
  readonly " $fragmentType": "CompleteProfileDrawerFragment";
};
export type CompleteProfileDrawerFragment$key = {
  readonly " $data"?: CompleteProfileDrawerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CompleteProfileDrawerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CompleteProfileDrawerFragment",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isComplete",
            "storageKey": null
          },
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
            "concreteType": "Education",
            "kind": "LinkedField",
            "name": "education",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              }
            ],
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "professionalSummary",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "headline",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "resumeUrl",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AddressStepFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DateOfBirthStepFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "HeadlineStepFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CareerProfileStepFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "dcf27467f530a972e507a4bc4079e550";

export default node;
