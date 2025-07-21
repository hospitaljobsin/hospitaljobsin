/**
 * @generated SignedSource<<0f4f007f713dd6952cfd0b1c4f83682a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrgDetailHeaderClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrgDetailHeaderFragment">;
  readonly " $fragmentType": "OrgDetailHeaderClientComponentFragment";
};
export type OrgDetailHeaderClientComponentFragment$key = {
  readonly " $data"?: OrgDetailHeaderClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrgDetailHeaderClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrgDetailHeaderClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrgDetailHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "8d6dd99f47c969170e8703c1f7dc423e";

export default node;
