/**
 * @generated SignedSource<<f718cc0380c721ff2d10b640c3f3b944>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CompleteProfileDrawerJobFragment$data = {
  readonly applicationForm: {
    readonly fields: ReadonlyArray<{
      readonly defaultValue: string | null | undefined;
      readonly fieldName: string;
      readonly isRequired: boolean;
    }>;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicationFieldStepFragment">;
  readonly " $fragmentType": "CompleteProfileDrawerJobFragment";
};
export type CompleteProfileDrawerJobFragment$key = {
  readonly " $data"?: CompleteProfileDrawerJobFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CompleteProfileDrawerJobFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CompleteProfileDrawerJobFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
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
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ApplicationFieldStepFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "a676d5235837063ce5b45076fc29b064";

export default node;
