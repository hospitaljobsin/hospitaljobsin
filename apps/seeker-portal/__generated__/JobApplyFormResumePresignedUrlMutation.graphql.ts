/**
 * @generated SignedSource<<0d0956a9d455c5eb8b3d801ccda35219>>
 * @relayHash b7d893761b81d21f53742711790260d0
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b7d893761b81d21f53742711790260d0

import type { ConcreteRequest } from 'relay-runtime';
export type JobApplyFormResumePresignedUrlMutation$variables = Record<PropertyKey, never>;
export type JobApplyFormResumePresignedUrlMutation$data = {
  readonly createJobApplicantResumePresignedUrl: {
    readonly presignedUrl: string;
  };
};
export type JobApplyFormResumePresignedUrlMutation = {
  response: JobApplyFormResumePresignedUrlMutation$data;
  variables: JobApplyFormResumePresignedUrlMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "CreateJobApplicantResumePresignedURLPayload",
    "kind": "LinkedField",
    "name": "createJobApplicantResumePresignedUrl",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "presignedUrl",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "JobApplyFormResumePresignedUrlMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "JobApplyFormResumePresignedUrlMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "b7d893761b81d21f53742711790260d0",
    "metadata": {},
    "name": "JobApplyFormResumePresignedUrlMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "c167b28d58e7e2e22d3fd4eb6505ddfc";

export default node;
