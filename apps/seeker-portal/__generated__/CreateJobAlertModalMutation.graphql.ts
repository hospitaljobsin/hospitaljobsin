/**
 * @generated SignedSource<<511c6d83ac8db7d9379971578afe247d>>
 * @relayHash 08979f748fce2b59ab6ab57f485d6e11
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 08979f748fce2b59ab6ab57f485d6e11

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
export type CreateJobAlertModalMutation$variables = {
  filters: AlertFiltersInput;
  frequency: JobAlertFrequency;
};
export type CreateJobAlertModalMutation$data = {
  readonly createJobAlert: {
    readonly __typename: "JobAlert";
    readonly __typename: "JobAlert";
    readonly " $fragmentSpreads": FragmentRefs<"JobAlertFragment">;
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
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v4 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "JobAlertAlreadyExistsError",
  "abstractKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": (v3/*: any*/),
  "type": "MaxJobAlertsReachedError",
  "abstractKey": null
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
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "JobAlertFragment"
              }
            ],
            "type": "JobAlert",
            "abstractKey": null
          },
          (v4/*: any*/),
          (v5/*: any*/)
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v6/*: any*/),
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
                    "name": "maxExperience",
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
                    "name": "maxSalary",
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
                    "name": "searchTerm",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "JobAlert",
            "abstractKey": null
          },
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v6/*: any*/)
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
    "id": "08979f748fce2b59ab6ab57f485d6e11",
    "metadata": {},
    "name": "CreateJobAlertModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "c7e5c12eb45f408b412925e877320374";

export default node;
