/**
 * @generated SignedSource<<72b71b100099cf42834f0adb57d01a2d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type EmploymentType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "OTHER" | "PART_TIME" | "TEMPORARY" | "VOLUNTEER" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceFragment$data = {
  readonly analysis: {
    readonly __typename: "JobApplicantAnalysis";
    readonly analysedFields: {
      readonly workExperience: {
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
    readonly workExperience: ReadonlyArray<{
      readonly completedAt: any | null | undefined;
      readonly description: string | null | undefined;
      readonly employmentType: EmploymentType | null | undefined;
      readonly organization: string;
      readonly skills: ReadonlyArray<string>;
      readonly startedAt: any;
      readonly title: string;
    }>;
  };
  readonly " $fragmentType": "WorkExperienceFragment";
};
export type WorkExperienceFragment$key = {
  readonly " $data"?: WorkExperienceFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"WorkExperienceFragment">;
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
  "name": "WorkExperienceFragment",
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
          "concreteType": "WorkExperience",
          "kind": "LinkedField",
          "name": "workExperience",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "title",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "description",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "organization",
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "employmentType",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "skills",
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
                  "name": "workExperience",
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

(node as any).hash = "2635e066584c9c321e93ae2b793875e5";

export default node;
