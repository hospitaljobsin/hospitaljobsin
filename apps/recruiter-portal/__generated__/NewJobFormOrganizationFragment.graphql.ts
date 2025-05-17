/**
 * @generated SignedSource<<768d70c77fd87b9c56c3ce8273e8b326>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NewJobFormOrganizationFragment$data = {
  readonly __typename: "Organization";
  readonly id: string;
  readonly slug: string;
  readonly " $fragmentSpreads": FragmentRefs<"CancelNewJobModalOrganizationFragment">;
  readonly " $fragmentType": "NewJobFormOrganizationFragment";
};
export type NewJobFormOrganizationFragment$key = {
  readonly " $data"?: NewJobFormOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewJobFormOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "NewJobFormOrganizationFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CancelNewJobModalOrganizationFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "16ef2d1709bf341a7fc52606ce9beb37";

export default node;
