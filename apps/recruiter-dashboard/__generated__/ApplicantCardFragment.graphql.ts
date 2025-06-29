/**
 * @generated SignedSource<<49c8d442f42ab6ff646c75b1ea080f1e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type ApplicantCardFragment$data = {
  readonly account: {
    readonly avatarUrl: string;
    readonly fullName: string;
  };
  readonly analysis: {
    readonly __typename: "JobApplicantAnalysis";
    readonly createdAt: any;
    readonly overallSummary: string | null | undefined;
    readonly riskFlags: ReadonlyArray<string> | null | undefined;
    readonly strengths: ReadonlyArray<string> | null | undefined;
  } | {
    readonly __typename: "JobApplicantAnalysisFailed";
    readonly __typename: "JobApplicantAnalysisFailed";
  } | {
    readonly __typename: "JobApplicantAnalysisPending";
    readonly __typename: "JobApplicantAnalysisPending";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly id: string;
  readonly overallScore: number;
  readonly profileSnapshot: {
    readonly headline: string | null | undefined;
  };
  readonly slug: string;
  readonly status: JobApplicantStatus;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantStatusUpdater_job">;
  readonly " $fragmentType": "ApplicantCardFragment";
};
export type ApplicantCardFragment$key = {
  readonly " $data"?: ApplicantCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantCardFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
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
      "concreteType": "ProfileSnapshot",
      "kind": "LinkedField",
      "name": "profileSnapshot",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "headline",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "overallScore",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "analysis",
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
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "overallSummary",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "strengths",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "riskFlags",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "createdAt",
              "storageKey": null
            }
          ],
          "type": "JobApplicantAnalysis",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ApplicantStatusUpdater_job"
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "f0bd5426d8d05d66834f6342519bd82b";

export default node;
