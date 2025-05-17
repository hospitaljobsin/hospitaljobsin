/**
 * @generated SignedSource<<07886ebde1f70e5a28dadb00adc3df5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type JobEditFormMutation$variables = {
  description: string;
  expiresAt?: any | null | undefined;
  jobId: string;
  jobType?: JobType | null | undefined;
  location?: string | null | undefined;
  maxExperience?: number | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  skills: ReadonlyArray<string>;
  title: string;
  vacancies?: number | null | undefined;
  workMode?: WorkMode | null | undefined;
};
export type JobEditFormMutation$data = {
  readonly updateJob: {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "UpdateJobSuccess";
    readonly __typename: "UpdateJobSuccess";
    readonly job: {
      readonly slug: string;
      readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment" | "JobDetailsFragment" | "JobEditFormFragment" | "JobFragment" | "JobTabsFragment">;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type JobEditFormMutation = {
  response: JobEditFormMutation$data;
  variables: JobEditFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "description"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "expiresAt"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobId"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxExperience"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "skills"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "vacancies"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v13 = [
  {
    "kind": "Variable",
    "name": "description",
    "variableName": "description"
  },
  {
    "kind": "Variable",
    "name": "expiresAt",
    "variableName": "expiresAt"
  },
  {
    "kind": "Variable",
    "name": "jobId",
    "variableName": "jobId"
  },
  {
    "kind": "Variable",
    "name": "jobType",
    "variableName": "jobType"
  },
  {
    "kind": "Variable",
    "name": "location",
    "variableName": "location"
  },
  {
    "kind": "Variable",
    "name": "maxExperience",
    "variableName": "maxExperience"
  },
  {
    "kind": "Variable",
    "name": "maxSalary",
    "variableName": "maxSalary"
  },
  {
    "kind": "Variable",
    "name": "minExperience",
    "variableName": "minExperience"
  },
  {
    "kind": "Variable",
    "name": "minSalary",
    "variableName": "minSalary"
  },
  {
    "kind": "Variable",
    "name": "skills",
    "variableName": "skills"
  },
  {
    "kind": "Variable",
    "name": "title",
    "variableName": "title"
  },
  {
    "kind": "Variable",
    "name": "vacancies",
    "variableName": "vacancies"
  },
  {
    "kind": "Variable",
    "name": "workMode",
    "variableName": "workMode"
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "JobEditFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v13/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJob",
        "plural": false,
        "selections": [
          (v14/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Job",
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v15/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobTabsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobControlsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobDetailsFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobFragment"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobEditFormFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "UpdateJobSuccess",
            "abstractKey": null
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
    "argumentDefinitions": [
      (v10/*: any*/),
      (v0/*: any*/),
      (v9/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/),
      (v8/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v5/*: any*/),
      (v1/*: any*/),
      (v12/*: any*/),
      (v3/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "Operation",
    "name": "JobEditFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v13/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJob",
        "plural": false,
        "selections": [
          (v14/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Job",
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "externalApplicationUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isAdmin",
                        "storageKey": null
                      },
                      (v16/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      (v15/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isActive",
                    "storageKey": null
                  },
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
                    "name": "skills",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "minSalary",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "maxSalary",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasSalaryRange",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "minExperience",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "maxExperience",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasExperienceRange",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "currency",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "workMode",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "location",
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
                    "name": "updatedAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "JobApplicationForm",
                    "kind": "LinkedField",
                    "name": "applicationForm",
                    "plural": false,
                    "selections": [
                      (v14/*: any*/),
                      (v16/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "viewCount",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "JobMetricPoint",
                    "kind": "LinkedField",
                    "name": "viewMetricPoints",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "timestamp",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "JobApplicantCount",
                    "kind": "LinkedField",
                    "name": "applicantCount",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "applied",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "shortlisted",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "interviewed",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "onHold",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "offered",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "vacancies",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "expiresAt",
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "UpdateJobSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "81fa612bc43777094f6d86416d1aaac5",
    "id": null,
    "metadata": {},
    "name": "JobEditFormMutation",
    "operationKind": "mutation",
    "text": "mutation JobEditFormMutation(\n  $title: String!\n  $description: String!\n  $skills: [String!]!\n  $location: String\n  $jobId: ID!\n  $minSalary: Int\n  $maxSalary: Int\n  $minExperience: Int\n  $maxExperience: Int\n  $expiresAt: datetime\n  $workMode: WorkMode\n  $jobType: JobType\n  $vacancies: Int\n) {\n  updateJob(title: $title, description: $description, skills: $skills, location: $location, jobId: $jobId, minSalary: $minSalary, maxSalary: $maxSalary, minExperience: $minExperience, maxExperience: $maxExperience, expiresAt: $expiresAt, workMode: $workMode, jobType: $jobType, vacancies: $vacancies) {\n    __typename\n    ... on UpdateJobSuccess {\n      __typename\n      job {\n        slug\n        ...JobTabsFragment\n        ...JobControlsFragment\n        ...JobDetailsFragment\n        ...JobFragment\n        ...JobEditFormFragment\n        id\n      }\n    }\n    ... on JobNotFoundError {\n      __typename\n    }\n    ... on OrganizationAuthorizationError {\n      __typename\n    }\n  }\n}\n\nfragment CancelEditJobModalJobFragment on Job {\n  __typename\n  slug\n  organization {\n    slug\n    id\n  }\n}\n\nfragment JobControlsFragment on Job {\n  id\n  isActive\n  ...UnpublishJobModalFragment\n  ...PublishJobModalFragment\n}\n\nfragment JobDetailsFragment on Job {\n  title\n  description\n  slug\n  skills\n  minSalary\n  maxSalary\n  hasSalaryRange\n  minExperience\n  maxExperience\n  hasExperienceRange\n  currency\n  workMode\n  type\n  location\n  createdAt\n  updatedAt\n  isActive\n  externalApplicationUrl\n  applicationForm {\n    __typename\n    id\n  }\n  organization {\n    isAdmin\n    name\n    id\n  }\n  ...JobControlsFragment\n  ...JobStatisticsFragment\n}\n\nfragment JobEditFormFragment on Job {\n  id\n  title\n  description\n  minExperience\n  maxExperience\n  minSalary\n  maxSalary\n  vacancies\n  skills\n  type\n  workMode\n  expiresAt\n  location\n  ...CancelEditJobModalJobFragment\n}\n\nfragment JobFragment on Job {\n  slug\n  title\n  skills\n  viewCount\n  createdAt\n  applicantCount {\n    applied\n    shortlisted\n    interviewed\n    onHold\n    offered\n  }\n  vacancies\n}\n\nfragment JobStatisticsFragment on Job {\n  viewCount\n  viewMetricPoints {\n    timestamp\n    count\n  }\n}\n\nfragment JobTabsFragment on Job {\n  externalApplicationUrl\n  organization {\n    isAdmin\n    id\n  }\n}\n\nfragment PublishJobModalFragment on Job {\n  id\n}\n\nfragment UnpublishJobModalFragment on Job {\n  id\n}\n"
  }
};
})();

(node as any).hash = "7418f1b2c39e45adcd40f9e02e3bcd1e";

export default node;
