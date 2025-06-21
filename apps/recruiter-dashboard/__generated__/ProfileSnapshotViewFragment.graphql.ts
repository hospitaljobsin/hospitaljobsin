/**
 * @generated SignedSource<<4ad9714baa033957aced7de3139f761e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type EmploymentType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "OTHER" | "PART_TIME" | "TEMPORARY" | "VOLUNTEER" | "%future added value";
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type LicenseVerificationStatus = "PENDING" | "REJECTED" | "VERIFIED" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type ProfileSnapshotViewFragment$data = {
  readonly address: string;
  readonly category: string | null | undefined;
  readonly certifications: ReadonlyArray<{
    readonly certificationUrl: string;
    readonly createdAt: any;
    readonly expiresAt: any | null | undefined;
    readonly issuer: string;
    readonly name: string;
  }>;
  readonly dateOfBirth: any | null | undefined;
  readonly education: ReadonlyArray<{
    readonly completedAt: any | null | undefined;
    readonly degree: string;
    readonly institution: string;
    readonly startedAt: any;
  }>;
  readonly gender: GenderType | null | undefined;
  readonly jobPreferences: ReadonlyArray<string>;
  readonly languages: ReadonlyArray<{
    readonly name: string;
    readonly proficiency: string;
  }>;
  readonly licenses: ReadonlyArray<{
    readonly expiresAt: any | null | undefined;
    readonly issuedAt: any;
    readonly issuer: string;
    readonly licenseNumber: string;
    readonly name: string;
    readonly verificationStatus: LicenseVerificationStatus;
    readonly verifiedAt: any | null | undefined;
  }>;
  readonly locationsOpenToWork: ReadonlyArray<string>;
  readonly maritalStatus: MaritalStatusType | null | undefined;
  readonly openToRelocationAnywhere: boolean;
  readonly salaryExpectations: {
    readonly negotiable: boolean;
    readonly preferredMonthlySalaryInr: number;
  } | null | undefined;
  readonly workExperience: ReadonlyArray<{
    readonly completedAt: any | null | undefined;
    readonly employmentType: EmploymentType | null | undefined;
    readonly organization: string;
    readonly skills: ReadonlyArray<string>;
    readonly startedAt: any;
    readonly title: string;
  }>;
  readonly " $fragmentType": "ProfileSnapshotViewFragment";
};
export type ProfileSnapshotViewFragment$key = {
  readonly " $data"?: ProfileSnapshotViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileSnapshotViewFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startedAt",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedAt",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "issuer",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiresAt",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileSnapshotViewFragment",
  "selections": [
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
      "name": "dateOfBirth",
      "storageKey": null
    },
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
      "name": "locationsOpenToWork",
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
      "concreteType": "Education",
      "kind": "LinkedField",
      "name": "education",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "degree",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "institution",
          "storageKey": null
        },
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "License",
      "kind": "LinkedField",
      "name": "licenses",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "licenseNumber",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "issuedAt",
          "storageKey": null
        },
        (v4/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "verificationStatus",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "verifiedAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Language",
      "kind": "LinkedField",
      "name": "languages",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "proficiency",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "jobPreferences",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "WorkExperience",
      "kind": "LinkedField",
      "name": "workExperience",
      "plural": true,
      "selections": [
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
          "name": "organization",
          "storageKey": null
        },
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "employmentType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "skills",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "SalaryExpectations",
      "kind": "LinkedField",
      "name": "salaryExpectations",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "preferredMonthlySalaryInr",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "negotiable",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Certification",
      "kind": "LinkedField",
      "name": "certifications",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "certificationUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        (v4/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ProfileSnapshot",
  "abstractKey": null
};
})();

(node as any).hash = "ad7c7af6fb6074128a4750aff2355992";

export default node;
