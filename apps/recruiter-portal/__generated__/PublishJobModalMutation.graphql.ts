/**
 * @generated SignedSource<<7d68aced865bb12f2c1c69d013e3729d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PublishJobModalMutation$variables = {
  jobId: string;
};
export type PublishJobModalMutation$data = {
  readonly publishJob: {
    readonly __typename: "Job";
    readonly __typename: "Job";
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment">;
  } | {
    readonly __typename: "JobNotFoundError";
    readonly __typename: "JobNotFoundError";
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PublishJobModalMutation = {
  response: PublishJobModalMutation$data;
  variables: PublishJobModalMutation$variables;
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
    "name": "PublishJobModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "publishJob",
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
    "name": "PublishJobModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "publishJob",
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
    "cacheID": "fdd64bc50bbd860f8f39b88b69c59cac",
    "id": null,
    "metadata": {},
    "name": "PublishJobModalMutation",
    "operationKind": "mutation",
    "text": "mutation PublishJobModalMutation(\n  $jobId: ID!\n) {\n  publishJob(jobId: $jobId) {\n    __typename\n    ... on Job {\n      __typename\n      ...JobControlsFragment\n    }\n    ... on JobNotFoundError {\n      __typename\n    }\n    ... on OrganizationAuthorizationError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment JobControlsFragment on Job {\n  id\n  isActive\n  ...UnpublishJobModalFragment\n  ...PublishJobModalFragment\n}\n\nfragment PublishJobModalFragment on Job {\n  id\n}\n\nfragment UnpublishJobModalFragment on Job {\n  id\n}\n"
  }
};
})();

(node as any).hash = "e5f307bb99808e5fe12dfde6ccc01f5a";

export default node;
