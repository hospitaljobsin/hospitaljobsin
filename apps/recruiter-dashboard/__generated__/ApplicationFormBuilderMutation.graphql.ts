/**
 * @generated SignedSource<<e971ceea82a59b9082320e7cfed08ba6>>
 * @relayHash 6881b76b338a3ee5c5c2f47bfee5897f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6881b76b338a3ee5c5c2f47bfee5897f

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicationFieldInput = {
  defaultValue?: string | null | undefined;
  fieldName: string;
  isRequired?: boolean;
};
export type ApplicationFormBuilderMutation$variables = {
  fields: ReadonlyArray<ApplicationFieldInput>;
  jobId: string;
};
export type ApplicationFormBuilderMutation$data = {
  readonly updateJobApplicationForm: {
    readonly __typename: "JobIsExternalError";
    readonly __typename: "JobIsExternalError";
  } | {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "UpdateJobApplicationFormSuccess";
    readonly job: {
      readonly " $fragmentSpreads": FragmentRefs<"JobStatisticsFragment">;
    };
    readonly jobApplicationForm: {
      readonly fields: ReadonlyArray<{
        readonly defaultValue: string | null | undefined;
        readonly fieldName: string;
        readonly isRequired: boolean;
      }>;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type ApplicationFormBuilderMutation = {
  response: ApplicationFormBuilderMutation$data;
  variables: ApplicationFormBuilderMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "fields"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "fields",
    "variableName": "fields"
  },
  {
    "kind": "Variable",
    "name": "jobId",
    "variableName": "jobId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "ApplicationField",
  "kind": "LinkedField",
  "name": "fields",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fieldName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "defaultValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isRequired",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "count",
  "storageKey": null
},
v6 = {
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ApplicationFormBuilderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJobApplicationForm",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "JobStatisticsFragment"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicationForm",
                "kind": "LinkedField",
                "name": "jobApplicationForm",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "UpdateJobApplicationFormSuccess",
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
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ApplicationFormBuilderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJobApplicationForm",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "viewCount",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v5/*: any*/)
                        ],
                        "type": "JobViewCountSuccess",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "viewMetricPoints",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
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
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "JobViewMetricPointsSuccess",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicationForm",
                "kind": "LinkedField",
                "name": "jobApplicationForm",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "UpdateJobApplicationFormSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "6881b76b338a3ee5c5c2f47bfee5897f",
    "metadata": {},
    "name": "ApplicationFormBuilderMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "def734fa81123011cdcf40abce5ceb07";

export default node;
