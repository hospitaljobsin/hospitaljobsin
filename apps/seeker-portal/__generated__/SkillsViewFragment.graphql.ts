/**
 * @generated SignedSource<<b903b9ae4a164008afd74e42f86428a4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SkillsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "SkillsViewFragment";
};
export type SkillsViewFragment$key = {
  readonly " $data"?: SkillsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SkillsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SkillsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "c3ac738cd23d937881217fe75dae59e0";

export default node;
