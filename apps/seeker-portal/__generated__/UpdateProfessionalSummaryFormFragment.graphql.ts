/**
 * @generated SignedSource<<1b03b866bca437735a6212e39e8937a7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateProfessionalSummaryFormFragment$data = {
  readonly professionalSummary: string | null | undefined;
  readonly " $fragmentType": "UpdateProfessionalSummaryFormFragment";
};
export type UpdateProfessionalSummaryFormFragment$key = {
  readonly " $data"?: UpdateProfessionalSummaryFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateProfessionalSummaryFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateProfessionalSummaryFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "professionalSummary",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "208c9312d1c38b3bc8468aef709ce553";

export default node;
