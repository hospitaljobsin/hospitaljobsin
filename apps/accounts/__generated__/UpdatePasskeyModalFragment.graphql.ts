/**
 * @generated SignedSource<<208683170b58b8e49ae54438ca55f1f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdatePasskeyModalFragment$data = {
  readonly id: string;
  readonly nickname: string;
  readonly " $fragmentType": "UpdatePasskeyModalFragment";
};
export type UpdatePasskeyModalFragment$key = {
  readonly " $data"?: UpdatePasskeyModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdatePasskeyModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdatePasskeyModalFragment",
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
      "name": "nickname",
      "storageKey": null
    }
  ],
  "type": "WebAuthnCredential",
  "abstractKey": null
};

(node as any).hash = "3aa947e15ff550164811e5aa9066d1ba";

export default node;
