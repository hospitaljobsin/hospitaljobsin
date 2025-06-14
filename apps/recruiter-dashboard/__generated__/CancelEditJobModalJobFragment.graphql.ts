/**
 * @generated SignedSource<<70d2be326c0d1f165b357025721e0fbe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CancelEditJobModalJobFragment$data = {
  readonly __typename: "Job";
  readonly organization: {
    readonly slug: string;
  };
  readonly slug: string;
  readonly " $fragmentType": "CancelEditJobModalJobFragment";
};
export type CancelEditJobModalJobFragment$key = {
  readonly " $data"?: CancelEditJobModalJobFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CancelEditJobModalJobFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CancelEditJobModalJobFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    (v0/*: any*/),
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
          (v0/*: any*/)
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Job",
  "abstractKey": null
};
})();

(node as any).hash = "881c7e8b7e61995744a5db9408d1ccec";

export default node;
