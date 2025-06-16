/**
 * @generated SignedSource<<3bc0d0b9c9f63e5514ee49795ff4f1a4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateCertificationsFormFragment$data = {
  readonly __typename: "Profile";
  readonly certifications: ReadonlyArray<{
    readonly certificationUrl: string;
    readonly createdAt: any;
    readonly expiresAt: any | null | undefined;
    readonly issuer: string;
    readonly name: string;
  }>;
  readonly " $fragmentType": "UpdateCertificationsFormFragment";
};
export type UpdateCertificationsFormFragment$key = {
  readonly " $data"?: UpdateCertificationsFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateCertificationsFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateCertificationsFormFragment",
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

(node as any).hash = "3eeffc723a4af005afb214917425fad3";

export default node;
