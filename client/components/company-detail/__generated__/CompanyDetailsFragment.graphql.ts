/**
 * @generated SignedSource<<86a6f152e59271d5e9c38ddc97af9b1d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CompanyDetailsFragment$data = {
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
  readonly " $fragmentType": "CompanyDetailsFragment";
};
export type CompanyDetailsFragment$key = {
  readonly " $data"?: CompanyDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CompanyDetailsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CompanyDetailsFragment",
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

(node as any).hash = "0c84a7ad568f6cb2ca98408a3fcb3e76";

export default node;
