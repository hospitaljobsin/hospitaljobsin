/**
 * @generated SignedSource<<61629a63f149bd20c9f61da069a82b97>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PasskeysListFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PasskeyAccountMetadataFragment" | "PasskeysControllerFragment" | "PasskeysListInternalFragment">;
  readonly " $fragmentType": "PasskeysListFragment";
};
export type PasskeysListFragment$key = {
  readonly " $data"?: PasskeysListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PasskeysListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PasskeysListFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PasskeyAccountMetadataFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PasskeysListInternalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PasskeysControllerFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "609e1976931593e317b64d62ac0ca179";

export default node;
