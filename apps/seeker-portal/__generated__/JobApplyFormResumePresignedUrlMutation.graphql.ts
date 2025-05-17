/**
 * @generated SignedSource<<63d95659b6eea432e51bab08272b4b09>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
    "cacheID": "aaebd5a6379619e715ccdd6de5e69e04",
    "id": null,
    "metadata": {},
    "name": "JobApplyFormResumePresignedUrlMutation",
    "operationKind": "mutation",
    "text": "mutation JobApplyFormResumePresignedUrlMutation {\n  createJobApplicantResumePresignedUrl {\n    presignedUrl\n  }\n}\n"
  }
};
})();

(node as any).hash = "c167b28d58e7e2e22d3fd4eb6505ddfc";

export default node;
