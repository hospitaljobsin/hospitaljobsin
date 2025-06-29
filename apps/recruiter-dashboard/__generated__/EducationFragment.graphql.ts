/**
 * @generated SignedSource<<56c12bcbeeb8719b37900287b6fa16d7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationFragment$data = {
  readonly analysis: {
    readonly __typename: "JobApplicantAnalysis";
    readonly analysedFields: {
      readonly education: {
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
    readonly __typename: "ProfileSnapshot";
    readonly education: ReadonlyArray<{
      readonly completedAt: any | null | undefined;
      readonly degree: string;
      readonly institution: string;
      readonly startedAt: any;
    }>;
  };
  readonly " $fragmentType": "EducationFragment";
};
export type EducationFragment$key = {
  readonly " $data"?: EducationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EducationFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EducationFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ProfileSnapshot",
      "kind": "LinkedField",
      "name": "profileSnapshot",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
              "name": "degree",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "institution",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "startedAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "completedAt",
              "storageKey": null
            }
          ],
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
        (v0/*: any*/),
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
                  "name": "education",
                  "plural": false,
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
                      "name": "score",
                      "storageKey": null
                    }
                  ],
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

(node as any).hash = "a165b7b80f884307ab5a58a38b4bf1e3";

export default node;
