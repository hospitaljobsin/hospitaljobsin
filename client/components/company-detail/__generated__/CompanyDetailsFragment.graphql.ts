/**
 * @generated SignedSource<<074ee90b7cf1cdeee1b9ffc681b063c0>>
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
    readonly country: string;
    readonly line1: string | null | undefined;
    readonly line2: string | null | undefined;
    readonly pincode: string | null | undefined;
    readonly state: string;
  };
  readonly description: string;
  readonly email: string;
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
          "name": "line1",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "line2",
          "storageKey": null
        },
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "country",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "pincode",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Company",
  "abstractKey": null
};

(node as any).hash = "cb22a6b4299c6515c9e891a13ad3349c";

export default node;
