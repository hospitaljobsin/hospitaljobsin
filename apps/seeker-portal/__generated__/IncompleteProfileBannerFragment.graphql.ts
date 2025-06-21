/**
 * @generated SignedSource<<daf73ea501c4887c7e6cf61e92b5502f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type IncompleteProfileBannerFragment$data = {
  readonly id: string;
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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

(node as any).hash = "d778e2517dc084a9ad88bf399de2090f";

export default node;
