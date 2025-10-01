/**
 * @generated SignedSource<<32905b5779c7df13d8289d484ff769ea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CareerProfileStepFragment$data = {
  readonly profile: {
    readonly careerProfile: {
      readonly locationsOpenToWork: ReadonlyArray<string>;
      readonly openToRelocationAnywhere: boolean;
    } | null | undefined;
  };
  readonly " $fragmentType": "CareerProfileStepFragment";
};
export type CareerProfileStepFragment$key = {
  readonly " $data"?: CareerProfileStepFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CareerProfileStepFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CareerProfileStepFragment",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Profile",
        "kind": "LinkedField",
        "name": "profile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "CareerProfile",
            "kind": "LinkedField",
            "name": "careerProfile",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "locationsOpenToWork",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "openToRelocationAnywhere",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "d6f2a93ee613b8fc5a4ac57db89898dc";

export default node;
