/**
 * @generated SignedSource<<e8b3a674410f60197685de051aff6119>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobTabsFragment$data = {
  readonly externalApplicationUrl: string | null | undefined;
  readonly organization: {
    readonly isAdmin: boolean;
  };
  readonly " $fragmentType": "JobTabsFragment";
};
export type JobTabsFragment$key = {
  readonly " $data"?: JobTabsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobTabsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobTabsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "externalApplicationUrl",
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isAdmin",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "afeebd7241165773a37fb98eed510ae3";

export default node;
