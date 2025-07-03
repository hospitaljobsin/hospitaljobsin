/**
 * @generated SignedSource<<b24e18d3efac041c4b27c3703e57e470>>
 * @relayHash b27c251c966dc6d9e3e327d86aa33071
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b27c251c966dc6d9e3e327d86aa33071

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UnpublishJobModalMutation$variables = {
  jobId: string;
};
export type UnpublishJobModalMutation$data = {
  readonly unpublishJob: {
    readonly __typename: "Job";
    readonly __typename: "Job";
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment">;
  } | {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "JobNotPublishedError";
    readonly __typename: "JobNotPublishedError";
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type UnpublishJobModalMutation = {
  response: UnpublishJobModalMutation$data;
  variables: UnpublishJobModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "jobId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "jobId",
    "variableName": "jobId"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UnpublishJobModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "unpublishJob",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "JobControlsFragment"
              }
            ],
            "type": "Job",
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
    "name": "UnpublishJobModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "unpublishJob",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isActive",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slug",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "vacancies",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "JobApplicationForm",
                "kind": "LinkedField",
                "name": "applicationForm",
                "plural": false,
                "selections": [
                  {
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
                        "name": "isRequired",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Job",
            "abstractKey": null
          },
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
    "id": "b27c251c966dc6d9e3e327d86aa33071",
    "metadata": {},
    "name": "UnpublishJobModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "dc97abc9896cb9e28bc42a22c8d80e43";

export default node;
