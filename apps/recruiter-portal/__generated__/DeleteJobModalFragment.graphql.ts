/**
 * @generated SignedSource<<9b11ba0bd547f9c7487f3cf4233b36a0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeleteJobModalFragment$data = {
  readonly id: string;
  readonly organization: {
    readonly id: string;
  };
  readonly " $fragmentType": "DeleteJobModalFragment";
};
export type DeleteJobModalFragment$key = {
  readonly " $data"?: DeleteJobModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteJobModalFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteJobModalFragment",
  "selections": [
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

(node as any).hash = "a7425b7da8f5fcb06bbf18d4cd4198f4";

export default node;
