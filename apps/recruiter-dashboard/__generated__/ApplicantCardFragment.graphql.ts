/**
 * @generated SignedSource<<00221daf9d06585ae7a33d804820a4cd>>
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
    readonly analysedFields: ReadonlyArray<{
      readonly analysis: string;
      readonly criterion: string;
      readonly score: number;
    }>;
    readonly createdAt: any;
    readonly overallScore: number | null | undefined;
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
  readonly profileSnapshot: {
    readonly headline: string | null | undefined;
  };
  readonly slug: string;
  readonly status?: JobApplicantStatus;
  readonly " $fragmentType": "ApplicantCardFragment";
};
export type ApplicantCardFragment$key = {
  readonly " $data"?: ApplicantCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "showStatus"
    }
  ],
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
              "name": "overallScore",
              "storageKey": null
            },
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
              "concreteType": "FieldAnalysis",
              "kind": "LinkedField",
              "name": "analysedFields",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "analysis",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "criterion",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "score",
                  "storageKey": null
                }
              ],
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
      "condition": "showStatus",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "f8fffdaaacaca82671655bdba7e12407";

export default node;
