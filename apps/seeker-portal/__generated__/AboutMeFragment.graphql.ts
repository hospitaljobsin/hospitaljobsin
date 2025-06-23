/**
 * @generated SignedSource<<6af244a7e3e33a9458152524475e8402>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AboutMeFragment$data = {
  readonly headline: string | null | undefined;
  readonly professionalSummary: string | null | undefined;
  readonly " $fragmentType": "AboutMeFragment";
};
export type AboutMeFragment$key = {
  readonly " $data"?: AboutMeFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AboutMeFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AboutMeFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "professionalSummary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "headline",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "71ff58b9e3c0eccc3fe0773250dcb9e6";

export default node;
