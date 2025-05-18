/**
 * @generated SignedSource<<6771196614ac567082f896e1ff031fd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ApplicantFieldInput = {
  fieldName: string;
  fieldValue: string;
};
export type JobApplyFormMutation$variables = {
  applicantFields: ReadonlyArray<ApplicantFieldInput>;
  jobId: string;
  resumeUrl: string;
};
export type JobApplyFormMutation$data = {
  readonly createJobApplication: {
    readonly __typename: "CreateJobApplicantSuccess";
    readonly __typename: "CreateJobApplicantSuccess";
    readonly jobApplicant: {
      readonly job: {
        readonly " $fragmentSpreads": FragmentRefs<"JobDetailsInternalFragment">;
      } | null | undefined;
    };
  } | {
    readonly __typename: "JobApplicantAlreadyExistsError";
    readonly __typename: "JobApplicantAlreadyExistsError";
  } | {
    readonly __typename: "JobIsExternalError";
    readonly __typename: "JobIsExternalError";
  } | {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "JobNotPublishedError";
    readonly __typename: "JobNotPublishedError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type JobApplyFormMutation = {
  response: JobApplyFormMutation$data;
  variables: JobApplyFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "applicantFields"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "resumeUrl"
},
v3 = [
  {
    "kind": "Variable",
    "name": "applicantFields",
    "variableName": "applicantFields"
  },
  {
    "kind": "Variable",
    "name": "jobId",
    "variableName": "jobId"
  },
  {
    "kind": "Variable",
    "name": "resumeUrl",
    "variableName": "resumeUrl"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "JobApplyFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJobApplication",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicant",
                "kind": "LinkedField",
                "name": "jobApplicant",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "JobDetailsInternalFragment"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "CreateJobApplicantSuccess",
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
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "JobApplyFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJobApplication",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicant",
                "kind": "LinkedField",
                "name": "jobApplicant",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isSaved",
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      },
                      (v7/*: any*/),
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
                            "name": "name",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "logoUrl",
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          (v5/*: any*/),
                          (v7/*: any*/)
                        ],
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
                        "name": "workMode",
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
                        "name": "skills",
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
                        "name": "hasSalaryRange",
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
                        "name": "hasExperienceRange",
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
                        "name": "createdAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isApplied",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "externalApplicationUrl",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "CreateJobApplicantSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cc14e58ab32eac5f58784f8efbc4006e",
    "id": null,
    "metadata": {},
    "name": "JobApplyFormMutation",
    "operationKind": "mutation",
    "text": "mutation JobApplyFormMutation($jobId:ID!,$applicantFields:[ApplicantFieldInput!]!,$resumeUrl:String!){createJobApplication(jobId:$jobId,applicantFields:$applicantFields,resumeUrl:$resumeUrl){__typename,...on CreateJobApplicantSuccess{__typename,jobApplicant{job{...JobDetailsInternalFragment,id},id}},...on JobNotFoundError{__typename},...on JobNotPublishedError{__typename},...on JobApplicantAlreadyExistsError{__typename},...on JobIsExternalError{__typename}}}fragment JobControlsFragment on Job{id,isSaved,...ShareJobFragment}fragment JobDetailsInternalFragment on Job{...JobControlsFragment,title,slug,description,type,workMode,location,skills,currency,hasSalaryRange,minSalary,maxSalary,hasExperienceRange,minExperience,maxExperience,createdAt,isApplied,externalApplicationUrl,organization{slug,name,description,logoUrl,id}}fragment ShareJobFragment on Job{slug,title,description,organization{name,logoUrl,slug,id}}"
  }
};
})();

(node as any).hash = "81a941318511897117b177a2b1461995";

export default node;
