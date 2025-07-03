/**
 * @generated SignedSource<<fc11eb17a52d940d7d5a68c4d8649e9b>>
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
  readonly vacancies: number | null | undefined;
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
      "kind": "ScalarField",
      "name": "vacancies",
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

(node as any).hash = "1026d48f073728a57babb7f775bf8590";

export default node;
