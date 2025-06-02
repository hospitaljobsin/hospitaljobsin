/**
 * @generated SignedSource<<a5421aad806d4f9499358385f07fd9b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DashboardClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardViewFragment">;
  readonly " $fragmentType": "DashboardClientComponentFragment";
};
export type DashboardClientComponentFragment$key = {
  readonly " $data"?: DashboardClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "searchTerm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "DashboardViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "501d636f37ea5627da262435113b555e";

export default node;
