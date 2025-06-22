/**
 * @generated SignedSource<<61d7d42ad25610d80d2d7e33e6b761f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfessionalSummaryFragment$data = {
  readonly professionalSummary: string | null | undefined;
  readonly " $fragmentType": "ProfessionalSummaryFragment";
};
export type ProfessionalSummaryFragment$key = {
  readonly " $data"?: ProfessionalSummaryFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfessionalSummaryFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfessionalSummaryFragment",
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

(node as any).hash = "737d103855900d10691f997e54b798e6";

export default node;
