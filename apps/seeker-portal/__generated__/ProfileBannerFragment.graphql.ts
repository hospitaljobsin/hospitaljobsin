/**
 * @generated SignedSource<<d4f132d153ae1099a5f1438a59d7e252>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileBannerFragment$data = {
  readonly avatarUrl: string;
  readonly fullName: string;
  readonly profile: {
    readonly updatedAt: any;
  };
  readonly " $fragmentType": "ProfileBannerFragment";
};
export type ProfileBannerFragment$key = {
  readonly " $data"?: ProfileBannerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileBannerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileBannerFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fullName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    },
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
            "name": "updatedAt",
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

(node as any).hash = "3ba6adacaf7086be65b99f5787baf970";

export default node;
