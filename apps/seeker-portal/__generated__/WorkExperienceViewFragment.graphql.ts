/**
 * @generated SignedSource<<f672d1ea3be80447e7aee2c4128efb89>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "WorkExperienceViewFragment";
};
export type WorkExperienceViewFragment$key = {
  readonly " $data"?: WorkExperienceViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"WorkExperienceViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkExperienceViewFragment",
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

(node as any).hash = "54820717aecd59e9bd1310dfc5c89728";

export default node;
