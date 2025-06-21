/**
 * @generated SignedSource<<b8b44282bc4096a30e0d5bb7e5d9a384>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsFragment$data = {
  readonly __typename: "ProfileSnapshot";
  readonly certifications: ReadonlyArray<{
    readonly certificationUrl: string;
    readonly createdAt: any;
    readonly expiresAt: any | null | undefined;
    readonly issuer: string;
    readonly name: string;
  }>;
  readonly " $fragmentType": "CertificationsFragment";
};
export type CertificationsFragment$key = {
  readonly " $data"?: CertificationsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CertificationsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CertificationsFragment",
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
  "type": "ProfileSnapshot",
  "abstractKey": null
};

(node as any).hash = "c732a90715cf47e5d550fd460beb56a5";

export default node;
