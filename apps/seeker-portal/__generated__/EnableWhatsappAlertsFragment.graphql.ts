/**
 * @generated SignedSource<<3c2e536c38effebed872945a84269c85>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EnableWhatsappAlertsFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly phoneNumber: string | null | undefined;
    readonly whatsappJobAlertsEnabled: boolean;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "EnableWhatsappAlertsFragment";
};
export type EnableWhatsappAlertsFragment$key = {
  readonly " $data"?: EnableWhatsappAlertsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EnableWhatsappAlertsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EnableWhatsappAlertsFragment",
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
              "name": "whatsappJobAlertsEnabled",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "phoneNumber",
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

(node as any).hash = "aa830ee613a8633f63859665b7dbd736";

export default node;
