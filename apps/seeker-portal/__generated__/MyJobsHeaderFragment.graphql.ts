/**
 * @generated SignedSource<<61ee8135ed06ba858b7da4c8d0ee7c6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MyJobsHeaderFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AuthNavigationFragment" | "IncompleteProfileBannerFragment">;
  } | {
    readonly __typename: "NotAuthenticatedError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "MyJobsHeaderFragment";
};
export type MyJobsHeaderFragment$key = {
  readonly " $data"?: MyJobsHeaderFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyJobsHeaderFragment">;
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
  "name": "MyJobsHeaderFragment",
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
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "AuthNavigationFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "IncompleteProfileBannerFragment"
            }
          ],
          "type": "Account",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/)
          ],
          "type": "NotAuthenticatedError",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "478274046d7759cb864dcd7224447e45";

export default node;
