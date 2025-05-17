/**
 * @generated SignedSource<<49d68d6f906f8b1e5ef2028a9c6bcd0b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationDetailsInternalFragment$data = {
  readonly address: {
    readonly city: string | null | undefined;
    readonly state: string | null | undefined;
  };
  readonly description: string | null | undefined;
  readonly email: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly website: string | null | undefined;
  readonly " $fragmentType": "OrganizationDetailsInternalFragment";
};
export type OrganizationDetailsInternalFragment$key = {
  readonly " $data"?: OrganizationDetailsInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsInternalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationDetailsInternalFragment",
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
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "6f357a176e8c6e89a44b04582a361ba4";

export default node;
