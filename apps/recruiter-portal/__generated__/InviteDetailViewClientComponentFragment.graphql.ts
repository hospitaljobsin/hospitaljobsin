/**
 * @generated SignedSource<<d275751e25a653dab70e1c144430b4ed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InviteDetailViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"InviteDetailViewFragment">;
  readonly " $fragmentType": "InviteDetailViewClientComponentFragment";
};
export type InviteDetailViewClientComponentFragment$key = {
  readonly " $data"?: InviteDetailViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteDetailViewClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inviteToken"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "InviteDetailViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "inviteToken",
          "variableName": "inviteToken"
        }
      ],
      "kind": "FragmentSpread",
      "name": "InviteDetailViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "6c017ed474fe660ac8bc543b4d258bdc";

export default node;
