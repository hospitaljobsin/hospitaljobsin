/**
 * @generated SignedSource<<5e7ac0fd69be583fabb20a2a685dd2cc>>
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
export type RequestSudoViewFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly authProviders: ReadonlyArray<AuthProvider>;
    readonly has2faEnabled: boolean;
    readonly twoFactorProviders: ReadonlyArray<TwoFactorProvider>;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "RequestSudoViewFragment";
};
export type RequestSudoViewFragment$key = {
  readonly " $data"?: RequestSudoViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RequestSudoViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RequestSudoViewFragment",
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
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "authProviders",
              "storageKey": null
            },
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
              "name": "has2faEnabled",
              "storageKey": null
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

(node as any).hash = "157c2a65ba74342eb210ae5eaa284938";

export default node;
