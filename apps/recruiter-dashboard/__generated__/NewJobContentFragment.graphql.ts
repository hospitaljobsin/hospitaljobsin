/**
 * @generated SignedSource<<99e4727f0d60ff5946618ed056205c1f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type NewJobContentFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isAdmin: boolean;
    readonly " $fragmentSpreads": FragmentRefs<"JobCreationFormFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "NewJobContentFragment";
};
export type NewJobContentFragment$key = {
  readonly " $data"?: NewJobContentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewJobContentFragment">;
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
  "name": "NewJobContentFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "organization",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAdmin",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "JobCreationFormFragment"
            }
          ],
          "type": "Organization",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "db90e68e1f68c5f953c96f1326cccba5";

export default node;
