/**
 * @generated SignedSource<<f35ee013dcdf239eed036886ea655931>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ResetPasswordViewFragment$data = {
  readonly id: string;
  readonly needs2fa: boolean;
  readonly " $fragmentSpreads": FragmentRefs<"TwoFactorAuthenticationResetPasswordFragment">;
  readonly " $fragmentType": "ResetPasswordViewFragment";
};
export type ResetPasswordViewFragment$key = {
  readonly " $data"?: ResetPasswordViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ResetPasswordViewFragment",
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
      "name": "needs2fa",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TwoFactorAuthenticationResetPasswordFragment"
    }
  ],
  "type": "PasswordResetToken",
  "abstractKey": null
};

(node as any).hash = "b4e5b07286777444d6e1cf6edfda44d0";

export default node;
