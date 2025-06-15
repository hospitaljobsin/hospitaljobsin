/**
 * @generated SignedSource<<437d0afa93ff01af451098948e24862f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplyFormFragment$data = {
  readonly applicationForm: {
    readonly fields: ReadonlyArray<{
      readonly defaultValue: string | null | undefined;
      readonly fieldName: string;
      readonly isRequired: boolean;
    }>;
  };
  readonly id: string;
  readonly organization: {
    readonly logoUrl: string;
    readonly name: string;
    readonly slug: string;
  };
  readonly slug: string;
  readonly title: string;
  readonly " $fragmentType": "JobApplyFormFragment";
};
export type JobApplyFormFragment$key = {
  readonly " $data"?: JobApplyFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplyFormFragment">;
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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobApplyFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
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
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "JobApplicationForm",
        "kind": "LinkedField",
        "name": "applicationForm",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ApplicationField",
            "kind": "LinkedField",
            "name": "fields",
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
                "name": "defaultValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isRequired",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
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
          },
          (v0/*: any*/)
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

(node as any).hash = "9f7c71fd6adcc70d82a8f561285afdb8";

export default node;
