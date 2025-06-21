/**
 * @generated SignedSource<<0518422d23ee7717de915e419ad56db2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type IncompleteProfileBannerFragment$data = {
  readonly profile: {
    readonly isComplete: boolean;
  };
  readonly " $fragmentType": "IncompleteProfileBannerFragment";
};
export type IncompleteProfileBannerFragment$key = {
  readonly " $data"?: IncompleteProfileBannerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IncompleteProfileBannerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IncompleteProfileBannerFragment",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Profile",
        "kind": "LinkedField",
        "name": "profile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isComplete",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "6cdb0384ce6b02ddabff187d448e756e";

export default node;
