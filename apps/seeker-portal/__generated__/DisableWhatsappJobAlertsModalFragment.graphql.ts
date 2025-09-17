/**
 * @generated SignedSource<<3a5b114776f8006af7dc88db4be7d645>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DisableWhatsappJobAlertsModalFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly id: string;
    readonly phoneNumber: string | null | undefined;
    readonly whatsappJobAlertsEnabled: boolean;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "DisableWhatsappJobAlertsModalFragment";
};
export type DisableWhatsappJobAlertsModalFragment$key = {
  readonly " $data"?: DisableWhatsappJobAlertsModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DisableWhatsappJobAlertsModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DisableWhatsappJobAlertsModalFragment",
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
              "name": "id",
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
              "name": "whatsappJobAlertsEnabled",
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

(node as any).hash = "e96fc9465ba48ff0116cce250c4d327f";

export default node;
