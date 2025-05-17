/**
 * @generated SignedSource<<14abb0cb73999a08df75bdadd9ffa3d4>>
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
    "cacheID": "023a1b813f3908dce051de040e10b90f",
    "id": null,
    "metadata": {},
    "name": "JobApplyFormMutation",
    "operationKind": "mutation",
    "text": "mutation JobApplyFormMutation(\n  $jobId: ID!\n  $applicantFields: [ApplicantFieldInput!]!\n  $resumeUrl: String!\n) {\n  createJobApplication(jobId: $jobId, applicantFields: $applicantFields, resumeUrl: $resumeUrl) {\n    __typename\n    ... on CreateJobApplicantSuccess {\n      __typename\n      jobApplicant {\n        job {\n          ...JobDetailsInternalFragment\n          id\n        }\n        id\n      }\n    }\n    ... on JobNotFoundError {\n      __typename\n    }\n    ... on JobNotPublishedError {\n      __typename\n    }\n    ... on JobApplicantAlreadyExistsError {\n      __typename\n    }\n    ... on JobIsExternalError {\n      __typename\n    }\n  }\n}\n\nfragment JobControlsFragment on Job {\n  id\n  isSaved\n  ...ShareJobFragment\n}\n\nfragment JobDetailsInternalFragment on Job {\n  ...JobControlsFragment\n  title\n  slug\n  description\n  type\n  workMode\n  location\n  skills\n  currency\n  hasSalaryRange\n  minSalary\n  maxSalary\n  hasExperienceRange\n  minExperience\n  maxExperience\n  createdAt\n  isApplied\n  externalApplicationUrl\n  organization {\n    slug\n    name\n    description\n    logoUrl\n    id\n  }\n}\n\nfragment ShareJobFragment on Job {\n  slug\n  title\n  description\n  organization {\n    name\n    logoUrl\n    slug\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "81a941318511897117b177a2b1461995";

export default node;
