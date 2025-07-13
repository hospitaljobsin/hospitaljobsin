/**
 * @generated SignedSource<<a86a5df828d56686e342e72a1118949d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type AutofillWithAISectionFragment$data = {
  readonly address: string;
  readonly category: string | null | undefined;
  readonly certifications: ReadonlyArray<{
    readonly __typename: "Certification";
  }>;
  readonly dateOfBirth: any | null | undefined;
  readonly education: ReadonlyArray<{
    readonly __typename: "Education";
  }>;
  readonly gender: GenderType | null | undefined;
  readonly headline: string | null | undefined;
  readonly languages: ReadonlyArray<{
    readonly __typename: "Language";
  }>;
  readonly licenses: ReadonlyArray<{
    readonly __typename: "License";
  }>;
  readonly locationsOpenToWork: ReadonlyArray<string>;
  readonly maritalStatus: MaritalStatusType | null | undefined;
  readonly openToRelocationAnywhere: boolean;
  readonly professionalSummary: string | null | undefined;
  readonly workExperience: ReadonlyArray<{
    readonly __typename: "WorkExperience";
  }>;
  readonly " $fragmentType": "AutofillWithAISectionFragment";
};
export type AutofillWithAISectionFragment$key = {
  readonly " $data"?: AutofillWithAISectionFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AutofillWithAISectionFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "__typename",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AutofillWithAISectionFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "headline",
      "storageKey": null
    },
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
      "name": "dateOfBirth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "gender",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maritalStatus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "category",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "openToRelocationAnywhere",
      "storageKey": null
    },
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
      "concreteType": "WorkExperience",
      "kind": "LinkedField",
      "name": "workExperience",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Education",
      "kind": "LinkedField",
      "name": "education",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Language",
      "kind": "LinkedField",
      "name": "languages",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "License",
      "kind": "LinkedField",
      "name": "licenses",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Certification",
      "kind": "LinkedField",
      "name": "certifications",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "BaseProfile",
  "abstractKey": "__isBaseProfile"
};
})();

(node as any).hash = "9306217f9c21c18a60f7a54537cb4865";

export default node;
