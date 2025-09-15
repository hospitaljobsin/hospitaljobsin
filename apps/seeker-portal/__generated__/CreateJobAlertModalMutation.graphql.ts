/**
 * @generated SignedSource<<704c9028e4f0903cbce53b5be3696de2>>
 * @relayHash 9303b0101ef80d5e901ec35d5aca26fc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9303b0101ef80d5e901ec35d5aca26fc

import type { ConcreteRequest } from 'relay-runtime';
export type JobAlertFrequency = "DAILY" | "MONTHLY" | "WEEKLY" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type AlertFiltersInput = {
  jobType?: ReadonlyArray<JobTypeFilter> | null | undefined;
  location?: string | null | undefined;
  maxExperience?: number | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  searchTerm?: string | null | undefined;
  workMode?: ReadonlyArray<WorkMode> | null | undefined;
};
export type CreateJobAlertModalMutation$variables = {
  filters: AlertFiltersInput;
  frequency: JobAlertFrequency;
};
export type CreateJobAlertModalMutation$data = {
  readonly createJobAlert: {
    readonly __typename: "JobAlert";
    readonly __typename: "JobAlert";
  } | {
    readonly __typename: "JobAlertAlreadyExistsError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type CreateJobAlertModalMutation = {
  response: CreateJobAlertModalMutation$data;
  variables: CreateJobAlertModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "frequency"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "filters",
    "variableName": "filters"
  },
  {
    "kind": "Variable",
    "name": "frequency",
    "variableName": "frequency"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "JobAlertAlreadyExistsError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateJobAlertModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJobAlert",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "CreateJobAlertModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createJobAlert",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
    "id": "9303b0101ef80d5e901ec35d5aca26fc",
    "metadata": {},
    "name": "CreateJobAlertModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "79ec8372d461a64b0e66e201168da866";

export default node;
