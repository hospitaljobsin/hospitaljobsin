/**
 * @generated SignedSource<<99a6dded0e67265cb1f909df7bc79d93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type ApplicantDetailsFragment$data = {
  readonly account: {
    readonly avatarUrl: string;
    readonly email: string;
    readonly fullName: string;
    readonly profile: {
      readonly address: string;
    };
  };
  readonly applicantFields: ReadonlyArray<{
    readonly fieldName: string;
    readonly fieldValue: string;
  }>;
  readonly status: JobApplicantStatus;
  readonly " $fragmentType": "ApplicantDetailsFragment";
};
export type ApplicantDetailsFragment$key = {
  readonly " $data"?: ApplicantDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantDetailsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ApplicantField",
      "kind": "LinkedField",
      "name": "applicantFields",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fieldName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fieldValue",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "account",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "fullName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "avatarUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
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
                  "name": "address",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            "action": "THROW"
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "63d9fe5f6e7f73db562c9c456413d98a";

export default node;
