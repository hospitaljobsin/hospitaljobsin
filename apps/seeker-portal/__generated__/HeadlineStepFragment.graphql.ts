/**
 * @generated SignedSource<<529c34d951cdc57924dc4effa3136dd6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type HeadlineStepFragment$data = {
  readonly profile: {
    readonly headline: string | null | undefined;
  };
  readonly " $fragmentType": "HeadlineStepFragment";
};
export type HeadlineStepFragment$key = {
  readonly " $data"?: HeadlineStepFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HeadlineStepFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HeadlineStepFragment",
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
            "name": "headline",
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

(node as any).hash = "500fe143a5bfcd94e77db3e784378ea4";

export default node;
