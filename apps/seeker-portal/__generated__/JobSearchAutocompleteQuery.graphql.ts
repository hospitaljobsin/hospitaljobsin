/**
 * @generated SignedSource<<8a39307faee0133b139d7619064de5e5>>
 * @relayHash 4cf4c328b8cb94228fbcccb333750b87
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4cf4c328b8cb94228fbcccb333750b87

import type { ConcreteRequest } from 'relay-runtime';
export type JobSearchAutocompleteQuery$variables = {
  searchTerm: string;
};
export type JobSearchAutocompleteQuery$data = {
  readonly autocompleteJobs: {
    readonly jobs: ReadonlyArray<{
      readonly __typename: "JobAutocompleteSuggestion";
      readonly displayName: string;
      readonly jobId: string;
    }>;
  };
};
export type JobSearchAutocompleteQuery = {
  response: JobSearchAutocompleteQuery$data;
  variables: JobSearchAutocompleteQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchTerm"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "searchTerm",
        "variableName": "searchTerm"
      }
    ],
    "concreteType": "AutocompleteJobsPayload",
    "kind": "LinkedField",
    "name": "autocompleteJobs",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "JobAutocompleteSuggestion",
        "kind": "LinkedField",
        "name": "jobs",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "displayName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "jobId",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "JobSearchAutocompleteQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "JobSearchAutocompleteQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "4cf4c328b8cb94228fbcccb333750b87",
    "metadata": {},
    "name": "JobSearchAutocompleteQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "f41d6e9b38db9fde485082afd5955566";

export default node;
