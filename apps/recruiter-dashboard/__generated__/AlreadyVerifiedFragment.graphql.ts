/**
 * @generated SignedSource<<7173abb54f9b48f9b77871467c19570f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AlreadyVerifiedFragment$data = {
  readonly __typename: "Organization";
  readonly verificationStatus: {
    readonly __typename: string;
    readonly message?: string;
    readonly rejectedAt?: any;
    readonly requestedAt?: any;
    readonly verified: {
      readonly verifiedAt: any;
    } | null | undefined;
  };
  readonly " $fragmentType": "AlreadyVerifiedFragment";
};
export type AlreadyVerifiedFragment$key = {
  readonly " $data"?: AlreadyVerifiedFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AlreadyVerifiedFragment">;
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
  "name": "AlreadyVerifiedFragment",
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
                "name": "verifiedAt",
                "storageKey": null
              }
            ],
            "type": "Verified",
            "abstractKey": null
          },
          "kind": "AliasedInlineFragmentSpread",
          "name": "verified"
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "rejectedAt",
              "storageKey": null
            }
          ],
          "type": "Rejected",
          "abstractKey": null
        },
        {
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
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "message",
              "storageKey": null
            }
          ],
          "type": "NotRequested",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
})();

(node as any).hash = "dbc10e443ae55edf0223dde7d4199314";

export default node;
