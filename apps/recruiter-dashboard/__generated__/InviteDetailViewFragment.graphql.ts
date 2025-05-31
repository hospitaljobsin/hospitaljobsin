/**
 * @generated SignedSource<<2d61f1d7d82010c9854a59a57dbc0eb5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type InviteDetailViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"InviteFormFragment">;
  readonly " $fragmentType": "InviteDetailViewFragment";
};
export type InviteDetailViewFragment$key = {
  readonly " $data"?: InviteDetailViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteDetailViewFragment">;
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
  "name": "InviteDetailViewFragment",
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
      "name": "InviteFormFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "6352cb34d64268cdd20b131fececc665";

export default node;
