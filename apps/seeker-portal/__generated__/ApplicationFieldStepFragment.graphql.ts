/**
 * @generated SignedSource<<5203a45f50e95cc5b0e5b0ada9c6c3d9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicationFieldStepFragment$data = {
  readonly applicationForm: {
    readonly fields: ReadonlyArray<{
      readonly defaultValue: string | null | undefined;
      readonly fieldName: string;
      readonly isRequired: boolean;
    }>;
  } | null | undefined;
  readonly " $fragmentType": "ApplicationFieldStepFragment";
};
export type ApplicationFieldStepFragment$key = {
  readonly " $data"?: ApplicationFieldStepFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicationFieldStepFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicationFieldStepFragment",
  "selections": [
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
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "e51cddf861515f52ca29dba00ac6ca6d";

export default node;
