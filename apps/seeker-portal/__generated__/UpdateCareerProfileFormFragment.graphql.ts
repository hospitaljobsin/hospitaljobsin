/**
 * @generated SignedSource<<3468988cb93473128aa90d23da8ff7fb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateCareerProfileFormFragment$data = {
  readonly __typename: "Profile";
  readonly certifications: ReadonlyArray<{
    readonly certificationUrl: string;
    readonly createdAt: any;
    readonly expiresAt: any | null | undefined;
    readonly issuer: string;
    readonly name: string;
  }>;
  readonly " $fragmentType": "UpdateCareerProfileFormFragment";
};
export type UpdateCareerProfileFormFragment$key = {
  readonly " $data"?: UpdateCareerProfileFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateCareerProfileFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateCareerProfileFormFragment",
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
      "concreteType": "Certification",
      "kind": "LinkedField",
      "name": "certifications",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "issuer",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "certificationUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expiresAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "0d933ed797848f20d79a312a04940c97";

export default node;
