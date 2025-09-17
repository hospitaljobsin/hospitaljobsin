/**
 * @generated SignedSource<<f0f7d9dead5a9828bd8c6ccd64f4ba70>>
 * @relayHash c3fc68d9a41291bda12dda0184d3238d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c3fc68d9a41291bda12dda0184d3238d

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
export type EditJobAlertModalMutation$variables = {
  filters: AlertFiltersInput;
  frequency: JobAlertFrequency;
  jobAlertId: string;
};
export type EditJobAlertModalMutation$data = {
  readonly updateJobAlert: {
    readonly __typename: "JobAlert";
    readonly " $fragmentSpreads": FragmentRefs<"EditJobAlertModalFragment" | "JobAlertFragment">;
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
  "type": "JobAlertNotFoundError",
  "abstractKey": null
},
v8 = {
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
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "JobAlertFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "EditJobAlertModalFragment"
              }
            ],
            "type": "JobAlert",
            "abstractKey": null
          },
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v8/*: any*/),
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
                "name": "lastSentAt",
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
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v8/*: any*/)
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
    "id": "c3fc68d9a41291bda12dda0184d3238d",
    "metadata": {},
    "name": "EditJobAlertModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "01bafe99d1c710550f56c0a6f0f36f80";

export default node;
