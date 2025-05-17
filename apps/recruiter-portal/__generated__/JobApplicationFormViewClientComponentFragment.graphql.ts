/**
 * @generated SignedSource<<d655b2b76db4d64126c340be8ae365cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobApplicationFormViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ApplicationFormTabFragment">;
  readonly " $fragmentType": "JobApplicationFormViewClientComponentFragment";
};
export type JobApplicationFormViewClientComponentFragment$key = {
  readonly " $data"?: JobApplicationFormViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplicationFormViewClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "jobSlug"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobApplicationFormViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "jobSlug",
          "variableName": "jobSlug"
        },
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "ApplicationFormTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "b81677be42f80c5495b99d92e44ab556";

export default node;
