/**
 * @generated SignedSource<<ad0daf495ba965a56abee0bfac9ce437>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ShareJobFragment$data = {
  readonly description: string | null | undefined;
  readonly organization: {
    readonly logoUrl: string;
    readonly name: string;
    readonly slug: string;
  };
  readonly slug: string;
  readonly title: string;
  readonly " $fragmentType": "ShareJobFragment";
};
export type ShareJobFragment$key = {
  readonly " $data"?: ShareJobFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ShareJobFragment">;
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
  "name": "ShareJobFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
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

(node as any).hash = "1938e3f3e1666a1322189d65eee01f9c";

export default node;
