/**
 * @generated SignedSource<<50094f429e4332149f9b0f7777a0eb09>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmploymentDetailsFragment$data = {
  readonly profile: {
    readonly __typename: "Profile";
  } | {
    readonly __typename: "ProfileNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "EmploymentDetailsFragment";
};
export type EmploymentDetailsFragment$key = {
  readonly " $data"?: EmploymentDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmploymentDetailsFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "__typename",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmploymentDetailsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": (v0/*: any*/),
          "type": "Profile",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v0/*: any*/),
          "type": "ProfileNotFoundError",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "c93d37bd5612b33bad1e07a3360cdb09";

export default node;
