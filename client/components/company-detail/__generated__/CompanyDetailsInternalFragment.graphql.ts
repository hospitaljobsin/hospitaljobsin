/**
 * @generated SignedSource<<09a2d070110a0c1aa381194da249bfb0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CompanyDetailsInternalFragment$data = {
  readonly address: {
    readonly city: string;
    readonly state: string;
  };
  readonly description: string;
  readonly email: string;
  readonly logoUrl: string | null | undefined;
  readonly name: string;
  readonly phone: string;
  readonly website: string;
  readonly " $fragmentType": "CompanyDetailsInternalFragment";
};
export type CompanyDetailsInternalFragment$key = {
  readonly " $data"?: CompanyDetailsInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CompanyDetailsInternalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CompanyDetailsInternalFragment",
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
      "name": "logoUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "website",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phone",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Address",
      "kind": "LinkedField",
      "name": "address",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "city",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "state",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Company",
  "abstractKey": null
};

(node as any).hash = "04d8f108fcb5d05e6de64c9f7d3dd292";

export default node;
