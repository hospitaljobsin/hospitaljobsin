/**
 * @generated SignedSource<<bb90853cbc3d3b499c5ebb51b1d32a68>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
    "cacheID": "db61784e743c28212b93e77b99a85a61",
    "id": null,
    "metadata": {},
    "name": "JobEditFormMutation",
    "operationKind": "mutation",
    "text": "mutation JobEditFormMutation($title:String!,$description:String!,$skills:[String!]!,$location:String,$jobId:ID!,$minSalary:Int,$maxSalary:Int,$minExperience:Int,$maxExperience:Int,$expiresAt:DateTime,$workMode:WorkMode,$jobType:JobType,$vacancies:Int){updateJob(title:$title,description:$description,skills:$skills,location:$location,jobId:$jobId,minSalary:$minSalary,maxSalary:$maxSalary,minExperience:$minExperience,maxExperience:$maxExperience,expiresAt:$expiresAt,workMode:$workMode,jobType:$jobType,vacancies:$vacancies){__typename,...on UpdateJobSuccess{__typename,job{slug,...JobTabsFragment,...JobControlsFragment,...JobDetailsFragment,...JobFragment,...JobEditFormFragment,id}},...on JobNotFoundError{__typename},...on OrganizationAuthorizationError{__typename}}}fragment CancelEditJobModalJobFragment on Job{__typename,slug,organization{slug,id}}fragment JobControlsFragment on Job{id,isActive,...UnpublishJobModalFragment,...PublishJobModalFragment}fragment JobDetailsFragment on Job{title,description,slug,skills,minSalary,maxSalary,hasSalaryRange,minExperience,maxExperience,hasExperienceRange,currency,workMode,type,location,createdAt,updatedAt,isActive,externalApplicationUrl,applicationForm{__typename,id},organization{isAdmin,name,id},...JobControlsFragment,...JobStatisticsFragment}fragment JobEditFormFragment on Job{id,title,description,minExperience,maxExperience,minSalary,maxSalary,vacancies,skills,type,workMode,expiresAt,location,...CancelEditJobModalJobFragment}fragment JobFragment on Job{slug,title,skills,viewCount,createdAt,applicantCount{applied,shortlisted,interviewed,onHold,offered},vacancies}fragment JobStatisticsFragment on Job{viewCount,viewMetricPoints{timestamp,count}}fragment JobTabsFragment on Job{externalApplicationUrl,organization{isAdmin,id}}fragment PublishJobModalFragment on Job{id}fragment UnpublishJobModalFragment on Job{id}"
  }
};
})();

(node as any).hash = "7bb7ee99692d1b4eb86fe205cd59b469";

export default node;
