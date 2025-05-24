/**
 * @generated SignedSource<<82fc8de5494c877dd2a1d36b548b08f8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type ApplicantFragment$data = {
  readonly account: {
    readonly avatarUrl: string;
    readonly email: string;
    readonly fullName: string;
  } | null | undefined;
  readonly slug: string;
  readonly status?: JobApplicantStatus;
  readonly " $fragmentType": "ApplicantFragment";
};
export type ApplicantFragment$key = {
  readonly " $data"?: ApplicantFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "showStatus"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "condition": "showStatus",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        }
      ]
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fullName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "avatarUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "74224d5c5421cea6edf56ee26fa717c0";

export default node;
