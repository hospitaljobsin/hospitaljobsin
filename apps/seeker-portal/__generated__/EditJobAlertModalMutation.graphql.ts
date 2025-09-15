/**
 * @generated SignedSource<<32bdefa94cff988a2af088f2ebd2fb85>>
 * @relayHash 9fb9223fac85164c9cbc351b4864008c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9fb9223fac85164c9cbc351b4864008c

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
export type EditJobAlertModalMutation$variables = {
  filters: AlertFiltersInput;
  frequency: JobAlertFrequency;
  jobAlertId: string;
};
export type EditJobAlertModalMutation$data = {
  readonly updateJobAlert: {
    readonly __typename: "JobAlert";
    readonly filters: {
      readonly jobType: ReadonlyArray<JobTypeFilter> | null | undefined;
      readonly location: string | null | undefined;
      readonly maxExperience: number | null | undefined;
      readonly maxSalary: number | null | undefined;
      readonly minExperience: number | null | undefined;
      readonly minSalary: number | null | undefined;
      readonly searchTerm: string | null | undefined;
      readonly workMode: ReadonlyArray<WorkMode> | null | undefined;
    };
    readonly frequency: JobAlertFrequency;
    readonly id: string;
  } | {
    readonly __typename: "JobAlertAlreadyExistsError";
    readonly message: string;
  } | {
    readonly __typename: "JobAlertNotFoundError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type EditJobAlertModalMutation = {
  response: EditJobAlertModalMutation$data;
  variables: EditJobAlertModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filters"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "frequency"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobAlertId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "filters",
    "variableName": "filters"
  },
  {
    "kind": "Variable",
    "name": "frequency",
    "variableName": "frequency"
  },
  {
    "kind": "Variable",
    "name": "jobAlertId",
    "variableName": "jobAlertId"
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
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/),
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "frequency",
      "storageKey": null
    }
  ],
  "type": "JobAlert",
  "abstractKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v8 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "JobAlertAlreadyExistsError",
  "abstractKey": null
},
v9 = {
  "kind": "InlineFragment",
  "selections": (v7/*: any*/),
  "type": "JobAlertNotFoundError",
  "abstractKey": null
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
    "name": "EditJobAlertModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJobAlert",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "EditJobAlertModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateJobAlert",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/)
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
    "id": "9fb9223fac85164c9cbc351b4864008c",
    "metadata": {},
    "name": "EditJobAlertModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "006437a2a8f719db8f3e76ff3af07ee0";

export default node;
