/**
 * @generated SignedSource<<32518f6c2b0377ef2bdc73c18062974d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type RejectedVerificationViewFragment$data = {
  readonly __typename: "Organization";
  readonly id: string;
  readonly name: string;
  readonly verificationStatus: {
    readonly __typename: string;
    readonly rejected: {
      readonly rejectedAt: any;
    } | null | undefined;
  };
  readonly " $fragmentSpreads": FragmentRefs<"RequestVerificationFormFragment">;
  readonly " $fragmentType": "RejectedVerificationViewFragment";
};
export type RejectedVerificationViewFragment$key = {
  readonly " $data"?: RejectedVerificationViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RejectedVerificationViewFragment">;
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
  "name": "RejectedVerificationViewFragment",
  "selections": [
    (v0/*: any*/),
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
      "name": "name",
      "storageKey": null
    },
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
                "name": "rejectedAt",
                "storageKey": null
              }
            ],
            "type": "Rejected",
            "abstractKey": null
          },
          "kind": "AliasedInlineFragmentSpread",
          "name": "rejected"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RequestVerificationFormFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
})();

(node as any).hash = "a76d50e0d311922a83d6e0de66e5495d";

export default node;
