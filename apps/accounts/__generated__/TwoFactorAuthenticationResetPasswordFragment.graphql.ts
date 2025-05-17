/**
 * @generated SignedSource<<6f5292f473822f00697fbb5b6d16f8b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AuthProvider = "OAUTH_GOOGLE" | "PASSWORD" | "WEBAUTHN_CREDENTIAL" | "%future added value";
export type TwoFactorProvider = "AUTHENTICATOR" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type TwoFactorAuthenticationResetPasswordFragment$data = {
  readonly authProviders: ReadonlyArray<AuthProvider>;
  readonly twoFactorProviders: ReadonlyArray<TwoFactorProvider>;
  readonly " $fragmentType": "TwoFactorAuthenticationResetPasswordFragment";
};
export type TwoFactorAuthenticationResetPasswordFragment$key = {
  readonly " $data"?: TwoFactorAuthenticationResetPasswordFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TwoFactorAuthenticationResetPasswordFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TwoFactorAuthenticationResetPasswordFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "twoFactorProviders",
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
  "type": "PasswordResetToken",
  "abstractKey": null
};

(node as any).hash = "4b44181db176a8f3902b74225ea391a9";

export default node;
