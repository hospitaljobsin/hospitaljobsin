/**
 * @generated SignedSource<<ad8af1c4b98334f901c33b4ad4e71c58>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteInviteModalFragment$data = {
  readonly email: string;
  readonly id: string;
  readonly " $fragmentType": "DeleteInviteModalFragment";
};
export type DeleteInviteModalFragment$key = {
  readonly " $data"?: DeleteInviteModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteInviteModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteInviteModalFragment",
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
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "OrganizationInvite",
  "abstractKey": null
};

(node as any).hash = "35e67b44e3176519ae015fa383d5bdea";

export default node;
