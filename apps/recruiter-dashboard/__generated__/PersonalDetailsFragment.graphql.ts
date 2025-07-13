/**
 * @generated SignedSource<<ddcaba9755673cbecd6e9940ed32d08b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type PersonalDetailsFragment$data = {
  readonly analysis: {
    readonly __typename: "JobApplicantAnalysis";
    readonly analysedFields: {
      readonly address: {
        readonly analysis: string;
        readonly score: number;
      } | null | undefined;
      readonly category: {
        readonly analysis: string;
        readonly score: number;
      } | null | undefined;
      readonly dateOfBirth: {
        readonly analysis: string;
        readonly score: number;
      } | null | undefined;
      readonly gender: {
        readonly analysis: string;
        readonly score: number;
      } | null | undefined;
      readonly maritalStatus: {
        readonly analysis: string;
        readonly score: number;
      } | null | undefined;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly profileSnapshot: {
    readonly address: string | null | undefined;
    readonly category: string | null | undefined;
    readonly dateOfBirth: any | null | undefined;
    readonly gender: GenderType | null | undefined;
    readonly maritalStatus: MaritalStatusType | null | undefined;
  };
  readonly " $fragmentType": "PersonalDetailsFragment";
};
export type PersonalDetailsFragment$key = {
  readonly " $data"?: PersonalDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PersonalDetailsFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
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
    "name": "score",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PersonalDetailsFragment",
  "selections": [
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
          "name": "gender",
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
          "name": "maritalStatus",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "category",
          "storageKey": null
        },
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
              "concreteType": "AnalysedFields",
              "kind": "LinkedField",
              "name": "analysedFields",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FieldAnalysis",
                  "kind": "LinkedField",
                  "name": "gender",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FieldAnalysis",
                  "kind": "LinkedField",
                  "name": "dateOfBirth",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FieldAnalysis",
                  "kind": "LinkedField",
                  "name": "maritalStatus",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FieldAnalysis",
                  "kind": "LinkedField",
                  "name": "category",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "FieldAnalysis",
                  "kind": "LinkedField",
                  "name": "address",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "type": "JobApplicantAnalysis",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};
})();

(node as any).hash = "de3c27db45f260cc33984548bcfa4c20";

export default node;
