/**
 * @generated SignedSource<<001e3f63eef71fe05e58fb5a1abf6880>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type AIApplicantMatchType = "CLOSE" | "LOW" | "PERFECT" | "%future added value";
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type ApplicantCardFragment$data = {
  readonly account: {
    readonly avatarUrl: string;
    readonly email: string;
    readonly fullName: string;
  };
  readonly aiInsight: {
    readonly matchReasons: ReadonlyArray<string>;
    readonly matchType: AIApplicantMatchType;
    readonly mismatchedFields: ReadonlyArray<string>;
    readonly score: number;
    readonly summary: string;
  } | null | undefined;
  readonly id: string;
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
            "name": "email",
            "storageKey": null
          },
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AIApplicantInsight",
      "kind": "LinkedField",
      "name": "aiInsight",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "matchType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "score",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "summary",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "matchReasons",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "mismatchedFields",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "1df7178eeeb92c4444bb361817bc711f";

export default node;
