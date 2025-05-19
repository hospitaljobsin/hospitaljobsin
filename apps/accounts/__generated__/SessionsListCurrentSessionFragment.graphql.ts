/**
 * @generated SignedSource<<cde602ddbc7d811fa1c402fc73aa8fe7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SessionsListCurrentSessionFragment$data = {
  readonly currentSession: {
    readonly " $fragmentSpreads": FragmentRefs<"SessionFragment">;
  };
  readonly " $fragmentType": "SessionsListCurrentSessionFragment";
};
export type SessionsListCurrentSessionFragment$key = {
  readonly " $data"?: SessionsListCurrentSessionFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SessionsListCurrentSessionFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SessionsListCurrentSessionFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Session",
      "kind": "LinkedField",
      "name": "currentSession",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SessionFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "fac1d283e74131bd3c8c6315b412180b";

export default node;
