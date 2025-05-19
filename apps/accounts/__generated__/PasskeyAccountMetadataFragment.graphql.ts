/**
 * @generated SignedSource<<78c0b52530a05277c1d212451f583315>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type AuthProvider = "OAUTH_GOOGLE" | "PASSWORD" | "WEBAUTHN_CREDENTIAL" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type PasskeyAccountMetadataFragment$data = {
  readonly authProviders: ReadonlyArray<AuthProvider>;
  readonly sudoModeExpiresAt: any | null | undefined;
  readonly " $fragmentType": "PasskeyAccountMetadataFragment";
};
export type PasskeyAccountMetadataFragment$key = {
  readonly " $data"?: PasskeyAccountMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PasskeyAccountMetadataFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PasskeyAccountMetadataFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sudoModeExpiresAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "authProviders",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "4963f15812acad692b8b9e76fe598a4f";

export default node;
