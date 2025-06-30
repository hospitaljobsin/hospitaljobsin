/**
 * @generated SignedSource<<11934947653cc28bdd242fe41892fe90>>
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
  readonly slug: string;
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
      "kind": "ScalarField",
      "name": "slug",
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

(node as any).hash = "0107fca759ab222b4bca0c03ae1d1e78";

export default node;
