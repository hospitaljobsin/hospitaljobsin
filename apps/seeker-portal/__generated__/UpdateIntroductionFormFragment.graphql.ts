/**
 * @generated SignedSource<<dade1f3fe373fb8005c348420002f600>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateIntroductionFormFragment$data = {
  readonly headline: string | null | undefined;
  readonly professionalSummary: string | null | undefined;
  readonly " $fragmentType": "UpdateIntroductionFormFragment";
};
export type UpdateIntroductionFormFragment$key = {
  readonly " $data"?: UpdateIntroductionFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateIntroductionFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateIntroductionFormFragment",
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

(node as any).hash = "c58278a87c3e97b66efa196594c14ef4";

export default node;
