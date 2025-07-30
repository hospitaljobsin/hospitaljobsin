/**
 * @generated SignedSource<<b9389550054ca45f6d8d30544acae108>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AccountSettingsViewFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment" | "PasswordFragment" | "PhoneNumberFragment" | "TwoFactorAuthenticationFragment" | "UpdateAccountDetailsFormFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "AccountSettingsViewFragment";
};
export type AccountSettingsViewFragment$key = {
  readonly " $data"?: AccountSettingsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AccountSettingsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AccountSettingsViewFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "AccountDetailsFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "UpdateAccountDetailsFormFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "TwoFactorAuthenticationFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "PasswordFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "PhoneNumberFragment"
            }
          ],
          "type": "Account",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "bc6220a1dcfb51e49684b8947a62453a";

export default node;
