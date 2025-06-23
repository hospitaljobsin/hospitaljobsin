/**
 * @generated SignedSource<<cf7a520cf4142bb0443ccda9425e4a26>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateAboutMeFormFragment$data = {
  readonly headline: string | null | undefined;
  readonly professionalSummary: string | null | undefined;
  readonly " $fragmentType": "UpdateAboutMeFormFragment";
};
export type UpdateAboutMeFormFragment$key = {
  readonly " $data"?: UpdateAboutMeFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateAboutMeFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateAboutMeFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "professionalSummary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "headline",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "7d79bec65e816eb284b9cbac3552289b";

export default node;
