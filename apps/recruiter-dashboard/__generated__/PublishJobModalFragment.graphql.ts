/**
 * @generated SignedSource<<eaf9d8d7bc9f1a0cf177749ed7fa59da>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PublishJobModalFragment$data = {
  readonly applicationForm: {
    readonly fields: ReadonlyArray<{
      readonly fieldName: string;
      readonly isRequired: boolean;
    }>;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "PublishJobModalFragment";
};
export type PublishJobModalFragment$key = {
  readonly " $data"?: PublishJobModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PublishJobModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PublishJobModalFragment",
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

(node as any).hash = "8265833f8108193eb5beae8ce4df261a";

export default node;
