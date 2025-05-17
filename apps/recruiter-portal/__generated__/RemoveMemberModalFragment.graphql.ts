/**
 * @generated SignedSource<<5921e09e715068f73ef284dc9c817441>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RemoveMemberModalFragment$data = {
  readonly node: {
    readonly id: string;
  };
  readonly " $fragmentType": "RemoveMemberModalFragment";
};
export type RemoveMemberModalFragment$key = {
  readonly " $data"?: RemoveMemberModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RemoveMemberModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RemoveMemberModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "OrganizationMemberEdge",
  "abstractKey": null
};

(node as any).hash = "c7b20da8b706ee2f127c7e2ced7ff55a";

export default node;
