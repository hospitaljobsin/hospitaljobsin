/**
 * @generated SignedSource<<d0e32eda0a86521d39ccc9090022a221>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SetWhatsappAlertsFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly phoneNumber: string | null | undefined;
    readonly sudoModeExpiresAt: any | null | undefined;
    readonly whatsappJobAlertsEnabled: boolean;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentSpreads": FragmentRefs<"DisableWhatsappJobAlertsModalFragment" | "EnableWhatsappJobAlertsModalFragment">;
  readonly " $fragmentType": "SetWhatsappAlertsFragment";
};
export type SetWhatsappAlertsFragment$key = {
  readonly " $data"?: SetWhatsappAlertsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SetWhatsappAlertsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SetWhatsappAlertsFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EnableWhatsappJobAlertsModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DisableWhatsappJobAlertsModalFragment"
    },
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
              "name": "whatsappJobAlertsEnabled",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "phoneNumber",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "sudoModeExpiresAt",
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

(node as any).hash = "55902c55d189c07930fac8ff92f4f4ce";

export default node;
