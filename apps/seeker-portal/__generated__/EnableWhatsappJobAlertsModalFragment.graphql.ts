/**
 * @generated SignedSource<<6f73d62801cd39504881555f1b0a68c1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EnableWhatsappJobAlertsModalFragment$data = {
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
  readonly " $fragmentType": "EnableWhatsappJobAlertsModalFragment";
};
export type EnableWhatsappJobAlertsModalFragment$key = {
  readonly " $data"?: EnableWhatsappJobAlertsModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EnableWhatsappJobAlertsModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EnableWhatsappJobAlertsModalFragment",
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

(node as any).hash = "cb563d3898233859fb73caa66c455609";

export default node;
