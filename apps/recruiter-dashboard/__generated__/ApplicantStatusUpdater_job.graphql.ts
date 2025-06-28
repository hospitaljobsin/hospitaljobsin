/**
 * @generated SignedSource<<0790d812ea1daea50e9b382527c56ac2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantStatusUpdater_job$data = {
  readonly id: string;
  readonly job: {
    readonly id: string;
  };
  readonly " $fragmentType": "ApplicantStatusUpdater_job";
};
export type ApplicantStatusUpdater_job$key = {
  readonly " $data"?: ApplicantStatusUpdater_job$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantStatusUpdater_job">;
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
  "name": "ApplicantStatusUpdater_job",
  "selections": [
    (v0/*: any*/),
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Job",
        "kind": "LinkedField",
        "name": "job",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};
})();

(node as any).hash = "c51502cf2b365eeb42a0e6ac157c05dd";

export default node;
