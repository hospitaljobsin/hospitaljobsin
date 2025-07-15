/**
 * @generated SignedSource<<d1e10313de8a9231487d4d768d397ee1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type NewJobViewFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isAdmin: boolean;
    readonly " $fragmentSpreads": FragmentRefs<"JobCreationFormFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "NewJobViewFragment";
};
export type NewJobViewFragment$key = {
  readonly " $data"?: NewJobViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewJobViewFragment">;
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
  "name": "NewJobViewFragment",
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

(node as any).hash = "3c2b05410bef5590a5caf7a166bf549a";

export default node;
