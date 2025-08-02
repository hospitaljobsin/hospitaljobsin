/**
 * @generated SignedSource<<6476721a99622ebea1c4d4c5c5a3a371>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PendingVerificationViewFragment$data = {
  readonly __typename: "Organization";
  readonly verificationStatus: {
    readonly __typename: string;
    readonly pending: {
      readonly requestedAt: any;
    } | null | undefined;
  };
  readonly " $fragmentType": "PendingVerificationViewFragment";
};
export type PendingVerificationViewFragment$key = {
  readonly " $data"?: PendingVerificationViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PendingVerificationViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PendingVerificationViewFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "verificationStatus",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "fragment": {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "requestedAt",
                "storageKey": null
              }
            ],
            "type": "Pending",
            "abstractKey": null
          },
          "kind": "AliasedInlineFragmentSpread",
          "name": "pending"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
})();

(node as any).hash = "5b1bcd978a8ad612048a9c2e9518e051";

export default node;
