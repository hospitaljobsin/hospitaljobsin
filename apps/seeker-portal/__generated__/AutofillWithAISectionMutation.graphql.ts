/**
 * @generated SignedSource<<85da0b9d6b33c0dc604eb9349a4d7172>>
 * @relayHash 4f72a824b2091e0200f6d540816eef0e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4f72a824b2091e0200f6d540816eef0e

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AutofillWithAISectionMutation$variables = {
  fileKey: string;
};
export type AutofillWithAISectionMutation$data = {
  readonly parseProfileDocument: {
    readonly address?: string;
    readonly dateOfBirth?: any | null | undefined;
    readonly headline?: string | null | undefined;
    readonly locationsOpenToWork?: ReadonlyArray<string>;
    readonly openToRelocationAnywhere?: boolean;
    readonly professionalSummary?: string | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"AboutMeFragment" | "AutofillWithAISectionFragment" | "CertificationsFragment" | "EducationFragment" | "LanguagesFragment" | "LicensesFragment" | "LocationPreferencesFragment" | "PersonalDetailsFragment" | "UpdateAboutMeFormFragment" | "UpdateCertificationsFormFragment" | "UpdateEducationFormFragment" | "UpdateLanguagesFormFragment" | "UpdateLicensesFormFragment" | "UpdateLocationPreferencesFormFragment" | "UpdatePersonalDetailsFormFragment" | "UpdateWorkExperienceFormFragment" | "WorkExperienceFragment">;
  };
};
export type AutofillWithAISectionMutation = {
  response: AutofillWithAISectionMutation$data;
  variables: AutofillWithAISectionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fileKey"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "fileKey",
    "variableName": "fileKey"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "address",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headline",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "professionalSummary",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateOfBirth",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "openToRelocationAnywhere",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "locationsOpenToWork",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v9 = [
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startedAt",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "completedAt",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "issuer",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AutofillWithAISectionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "parseProfileDocument",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdatePersonalDetailsFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PersonalDetailsFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "LanguagesFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateLanguagesFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateLocationPreferencesFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "LocationPreferencesFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateEducationFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "EducationFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateWorkExperienceFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "WorkExperienceFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "CertificationsFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateCertificationsFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "LicensesFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateLicensesFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AboutMeFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateAboutMeFormFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "AutofillWithAISectionFragment"
              }
            ],
            "type": "BaseProfile",
            "abstractKey": "__isBaseProfile"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AutofillWithAISectionMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "parseProfileDocument",
        "plural": false,
        "selections": [
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
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
                "concreteType": "WorkExperience",
                "kind": "LinkedField",
                "name": "workExperience",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Education",
                "kind": "LinkedField",
                "name": "education",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Language",
                "kind": "LinkedField",
                "name": "languages",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "License",
                "kind": "LinkedField",
                "name": "licenses",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Certification",
                "kind": "LinkedField",
                "name": "certifications",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Language",
                    "kind": "LinkedField",
                    "name": "languages",
                    "plural": true,
                    "selections": [
                      (v10/*: any*/),
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
                      (v11/*: any*/),
                      (v12/*: any*/)
                    ],
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
                        "name": "description",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "organization",
                        "storageKey": null
                      },
                      (v11/*: any*/),
                      (v12/*: any*/),
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
                    "concreteType": "Certification",
                    "kind": "LinkedField",
                    "name": "certifications",
                    "plural": true,
                    "selections": [
                      (v10/*: any*/),
                      (v13/*: any*/),
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "expiresAt",
                        "storageKey": null
                      }
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
                      (v10/*: any*/),
                      (v13/*: any*/),
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
                        "name": "registrationYear",
                        "storageKey": null
                      },
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
                  }
                ],
                "type": "Profile",
                "abstractKey": null
              }
            ],
            "type": "BaseProfile",
            "abstractKey": "__isBaseProfile"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4f72a824b2091e0200f6d540816eef0e",
    "metadata": {},
    "name": "AutofillWithAISectionMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "3b665dfb70fdb66d0e3ac9714ecdb232";

export default node;
