/**
 * @generated SignedSource<<5bf3d56506dade2dabfafe554c677de7>>
 * @relayHash bb50c48e818160e0389205c874fddd73
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID bb50c48e818160e0389205c874fddd73

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EmploymentType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "OTHER" | "PART_TIME" | "TEMPORARY" | "VOLUNTEER" | "%future added value";
export type WorkExperienceInput = {
  completedAt?: any | null | undefined;
  description?: string | null | undefined;
  employmentType?: EmploymentType | null | undefined;
  organization: string;
  skills: ReadonlyArray<string>;
  startedAt: any;
  title: string;
};
export type UpdateWorkExperienceFormMutation$variables = {
  workExperience: ReadonlyArray<WorkExperienceInput>;
};
export type UpdateWorkExperienceFormMutation$data = {
  readonly updateProfileExperience: {
    readonly profile?: {
      readonly workExperience: ReadonlyArray<{
        readonly completedAt: any | null | undefined;
        readonly description: string | null | undefined;
        readonly employmentType: EmploymentType | null | undefined;
        readonly organization: string;
        readonly skills: ReadonlyArray<string>;
        readonly startedAt: any;
        readonly title: string;
      }>;
      readonly " $fragmentSpreads": FragmentRefs<"UpdateWorkExperienceFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ResumeProgressAccountFragment">;
  };
};
export type UpdateWorkExperienceFormMutation = {
  response: UpdateWorkExperienceFormMutation$data;
  variables: UpdateWorkExperienceFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workExperience"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "workExperience",
    "variableName": "workExperience"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "WorkExperience",
  "kind": "LinkedField",
  "name": "workExperience",
  "plural": true,
  "selections": [
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
      "name": "organization",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "employmentType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "skills",
      "storageKey": null
    }
  ],
  "storageKey": null
},
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
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateWorkExperienceFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileExperience",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ResumeProgressAccountFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateWorkExperienceFormFragment"
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateWorkExperienceFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileExperience",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "phoneNumber",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updatedAt",
                    "storageKey": null
                  },
                  (v4/*: any*/),
                  (v3/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/)
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
    "id": "bb50c48e818160e0389205c874fddd73",
    "metadata": {},
    "name": "UpdateWorkExperienceFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "0727ad2ddf542a259892523dff20d053";

export default node;
