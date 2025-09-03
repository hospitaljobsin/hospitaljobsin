/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";

export type JobSearchAutocompleteQuery$variables = {
    searchTerm: string;
};

export type JobSearchAutocompleteQuery$data = {
    readonly jobSearchAutocompleteSuggestions: {
        readonly suggestions: readonly {
            readonly __typename: "JobAutocompleteSuggestion";
            readonly title: string;
        }[];
    };
};

export type JobSearchAutocompleteQuery = {
    readonly response: JobSearchAutocompleteQuery$data;
    readonly variables: JobSearchAutocompleteQuery$variables;
};

const node: ConcreteRequest = {
    "fragment": {
        "argumentDefinitions": [
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "searchTerm"
            }
        ],
        "kind": "Fragment",
        "metadata": null,
        "name": "JobSearchAutocompleteQuery",
        "selections": [
            {
                "alias": null,
                "args": [
                    {
                        "kind": "Variable",
                        "name": "searchTerm",
                        "variableName": "searchTerm"
                    }
                ],
                "concreteType": "SearchJobsAutocompleteSuggestionsPayload",
                "kind": "LinkedField",
                "name": "jobSearchAutocompleteSuggestions",
                "plural": false,
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "JobAutocompleteSuggestion",
                        "kind": "LinkedField",
                        "name": "suggestions",
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
                                "name": "title",
                                "storageKey": null
                            }
                        ],
                        "storageKey": null
                    }
                ],
                "storageKey": null
            }
        ],
        "type": "Query",
        "abstractKey": null
    },
    "kind": "Request",
    "operation": {
        "argumentDefinitions": [
            {
                "defaultValue": null,
                "kind": "LocalArgument",
                "name": "searchTerm"
            }
        ],
        "kind": "Operation",
        "name": "JobSearchAutocompleteQuery",
        "selections": [
            {
                "alias": null,
                "args": [
                    {
                        "kind": "Variable",
                        "name": "searchTerm",
                        "variableName": "searchTerm"
                    }
                ],
                "concreteType": "SearchJobsAutocompleteSuggestionsPayload",
                "kind": "LinkedField",
                "name": "jobSearchAutocompleteSuggestions",
                "plural": false,
                "selections": [
                    {
                        "alias": null,
                        "args": null,
                        "concreteType": "JobAutocompleteSuggestion",
                        "kind": "LinkedField",
                        "name": "suggestions",
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
                                "name": "title",
                                "storageKey": null
                            }
                        ],
                        "storageKey": null
                    }
                ],
                "storageKey": null
            }
        ]
    },
    "params": {
        "cacheID": "4b7c1a7e8f9c7b6e1a8c2b3e4f5g6h7i",
        "id": null,
        "metadata": {},
        "name": "JobSearchAutocompleteQuery",
        "operationKind": "query",
        "text": "query JobSearchAutocompleteQuery($searchTerm: String!) {\n  jobSearchAutocompleteSuggestions(searchTerm: $searchTerm) {\n    suggestions {\n      __typename\n      title\n    }\n  }\n}\n"
    }
};

export default node;