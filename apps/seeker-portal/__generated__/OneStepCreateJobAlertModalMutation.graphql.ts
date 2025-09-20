/**
 * @generated SignedSource<<511667dce0dcc19c8e5388413c280ef1>>
 * @relayHash 78d12494f5ab7008d7894874e8f962d0
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 78d12494f5ab7008d7894874e8f962d0

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
  searchTerm: string;
  workMode?: ReadonlyArray<WorkMode> | null | undefined;
};
export type OneStepCreateJobAlertModalMutation$variables = {
  filters: AlertFiltersInput;
  frequency: JobAlertFrequency;
};
export type OneStepCreateJobAlertModalMutation$data = {
  readonly createJobAlert: {
    readonly __typename: "JobAlert";
    readonly filters: {
      readonly jobType: ReadonlyArray<JobTypeFilter> | null | undefined;
      readonly location: string | null | undefined;
      readonly maxExperience: number | null | undefined;
      readonly maxSalary: number | null | undefined;
      readonly minExperience: number | null | undefined;
      readonly minSalary: number | null | undefined;
      readonly searchTerm: string;
      readonly workMode: ReadonlyArray<WorkMode> | null | undefined;
    };
    readonly frequency: JobAlertFrequency;
    readonly id: string;
  } | {
    readonly __typename: "JobAlertAlreadyExistsError";
    readonly message: string;
  } | {
    readonly __typename: "MaxJobAlertsReachedError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type OneStepCreateJobAlertModalMutation = {
  response: OneStepCreateJobAlertModalMutation$data;
  variables: OneStepCreateJobAlertModalMutation$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "frequency",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AlertFilters",
      "kind": "LinkedField",
      "name": "filters",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "searchTerm",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "jobType",
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
          "name": "minSalary",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "maxSalary",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobAlert",
  "abstractKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "JobAlertAlreadyExistsError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "MaxJobAlertsReachedError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OneStepCreateJobAlertModalMutation",
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
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
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
    "name": "OneStepCreateJobAlertModalMutation",
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
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
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
    "id": "78d12494f5ab7008d7894874e8f962d0",
    "metadata": {},
    "name": "OneStepCreateJobAlertModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "4451588a7703239fbadba103d1b85b8f";

export default node;
