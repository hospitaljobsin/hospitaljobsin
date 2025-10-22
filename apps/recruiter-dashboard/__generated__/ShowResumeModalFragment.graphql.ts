/**
 * @generated SignedSource<<dd15217f8da0980810f9f4246915fa35>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ShowResumeModalFragment$data = {
  readonly profileSnapshot: {
    readonly resumeUrl: string | null | undefined;
  };
  readonly " $fragmentType": "ShowResumeModalFragment";
};
export type ShowResumeModalFragment$key = {
  readonly " $data"?: ShowResumeModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ShowResumeModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowResumeModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ProfileSnapshot",
      "kind": "LinkedField",
      "name": "profileSnapshot",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "resumeUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "d0ce73142ef84f298b3ba4d52f541bd5";

export default node;
