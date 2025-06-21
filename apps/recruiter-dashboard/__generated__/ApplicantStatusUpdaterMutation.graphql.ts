/**
 * @generated SignedSource<<2b0bdb47ba3c29edf993447fa89b71c1>>
 * @relayHash a1b88549f840dd6ea4abc507cb4b54cc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a1b88549f840dd6ea4abc507cb4b54cc

import type { ConcreteRequest } from 'relay-runtime';
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
export type ApplicantStatusUpdaterMutation$variables = {
  applicantIds: ReadonlyArray<string>;
  jobId: string;
  status: JobApplicantStatus;
};
export type ApplicantStatusUpdaterMutation$data = {
  readonly updateJobApplicantsStatus: {
    readonly __typename: "JobApplicantsNotFoundError";
    readonly message: string;
  } | {
    readonly __typename: "JobIsExternalError";
    readonly message: string;
  } | {
    readonly __typename: "JobNotFoundError";
    readonly message: string;
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly message: string;
  } | {
    readonly __typename: "UpdateJobApplicantsStatusSuccess";
    readonly jobApplicants: ReadonlyArray<{
      readonly id: string;
      readonly status: JobApplicantStatus;
    }>;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type ApplicantStatusUpdaterMutation = {
  response: ApplicantStatusUpdaterMutation$data;
  variables: ApplicantStatusUpdaterMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "applicantIds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "jobApplicantIds",
        "variableName": "applicantIds"
      },
      {
        "kind": "Variable",
        "name": "jobId",
        "variableName": "jobId"
      },
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "updateJobApplicantsStatus",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "JobApplicant",
            "kind": "LinkedField",
            "name": "jobApplicants",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "type": "UpdateJobApplicantsStatusSuccess",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "JobNotFoundError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "JobIsExternalError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "JobApplicantsNotFoundError",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v3/*: any*/),
        "type": "OrganizationAuthorizationError",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ApplicantStatusUpdaterMutation",
    "selections": (v4/*: any*/),
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
    "name": "ApplicantStatusUpdaterMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "id": "a1b88549f840dd6ea4abc507cb4b54cc",
    "metadata": {},
    "name": "ApplicantStatusUpdaterMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "94f584b8666b814afa81b97203043d1a";

export default node;
