/**
 * @generated SignedSource<<466c6c7b265f5aee22824b64f915ae88>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobDetailViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment" | "RelatedJobsListFragment">;
  readonly " $fragmentType": "JobDetailViewFragment";
};
export type JobDetailViewFragment$key = {
  readonly " $data"?: JobDetailViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Variable",
    "name": "jobSlug",
    "variableName": "jobSlug"
  },
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "jobSlug"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobDetailViewFragment",
  "selections": [
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "JobDetailsFragment"
    },
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "RelatedJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "d6db5230f14f63d46789e0a3816a0220";

export default node;
