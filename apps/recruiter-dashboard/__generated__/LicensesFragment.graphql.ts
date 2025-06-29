/**
 * @generated SignedSource<<bd98095e08d8080991ee8e55a4d787a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type LicenseVerificationStatus = "PENDING" | "REJECTED" | "VERIFIED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type LicensesFragment$data = {
  readonly analysis: {
    readonly __typename: "JobApplicantAnalysis";
    readonly analysedFields: {
      readonly licenses: {
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
    readonly licenses: ReadonlyArray<{
      readonly issuer: string;
      readonly licenseNumber: string;
      readonly name: string;
      readonly registrationYear: number;
      readonly verificationStatus: LicenseVerificationStatus;
      readonly verifiedAt: any | null | undefined;
    }>;
  };
  readonly " $fragmentType": "LicensesFragment";
};
export type LicensesFragment$key = {
  readonly " $data"?: LicensesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LicensesFragment">;
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
  "name": "LicensesFragment",
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
          "concreteType": "License",
          "kind": "LinkedField",
          "name": "licenses",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "issuer",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "licenseNumber",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "registrationYear",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "verificationStatus",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "verifiedAt",
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
                  "name": "licenses",
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

(node as any).hash = "057a3b1107ecef3d55989ab95a0814a5";

export default node;
