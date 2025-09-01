/**
 * @generated SignedSource<<59d61f27d8aef293ac0c93e0f605b35a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type Currency = "INR" | "%future added value";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type RelatedJobFragment$data = {
  readonly currency: Currency;
  readonly location: string | null | undefined;
  readonly maxExperience: number | null | undefined;
  readonly maxSalary: number | null | undefined;
  readonly minExperience: number | null | undefined;
  readonly minSalary: number | null | undefined;
  readonly organization: {
    readonly logoUrl?: string;
    readonly name?: string;
    readonly slug: string;
    readonly verificationStatus: {
      readonly __typename: string;
      readonly verified: {
        readonly verifiedAt: any;
      } | null | undefined;
    };
  };
  readonly skills: ReadonlyArray<string>;
  readonly slug: string;
  readonly title: string;
  readonly type: JobType | null | undefined;
  readonly workMode: WorkMode | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment">;
  readonly " $fragmentType": "RelatedJobFragment";
};
export type RelatedJobFragment$key = {
  readonly " $data"?: RelatedJobFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RelatedJobFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "showOrganization"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "RelatedJobFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobControlsFragment"
    },
    (v0/*: any*/),
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
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "workMode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "skills",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "currency",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minSalary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxSalary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minExperience",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxExperience",
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "condition": "showOrganization",
            "kind": "Condition",
            "passingValue": true,
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
                "name": "logoUrl",
                "storageKey": null
              }
            ]
          },
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "verificationStatus",
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
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "verifiedAt",
                      "storageKey": null
                    }
                  ],
                  "type": "Verified",
                  "abstractKey": null
                },
                "kind": "AliasedInlineFragmentSpread",
                "name": "verified"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Job",
  "abstractKey": null
};
})();

(node as any).hash = "0e7f599134654db5cc9649c7ba358705";

export default node;
