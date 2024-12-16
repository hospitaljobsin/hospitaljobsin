/**
 * @generated SignedSource<<cc40400147cfbc73ce69d61785c9bdae>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PersonalDetailsFragment$data = {
  readonly profile: {
    readonly __typename: "Profile";
  } | {
    readonly __typename: "ProfileNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "PersonalDetailsFragment";
};
export type PersonalDetailsFragment$key = {
  readonly " $data"?: PersonalDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PersonalDetailsFragment">;
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
  "name": "PersonalDetailsFragment",
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

(node as any).hash = "5b0bd0f31285efbe3f5e0b3237dfd3c8";

export default node;
