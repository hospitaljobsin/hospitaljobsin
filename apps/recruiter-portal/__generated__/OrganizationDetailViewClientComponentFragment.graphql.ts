/**
 * @generated SignedSource<<041fce1cc9e5f4370820b1b21ac3337f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationDetailViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationOverviewTabFragment">;
  readonly " $fragmentType": "OrganizationDetailViewClientComponentFragment";
};
export type OrganizationDetailViewClientComponentFragment$key = {
  readonly " $data"?: OrganizationDetailViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailViewClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationDetailViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationOverviewTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "eb8434c7603a156d1fbb8c14b7f89e65";

export default node;
