/**
 * @generated SignedSource<<ea7edadf87712bfcc57d717a2284910c>>
 * @relayHash ff29daeb71125f936fa144d45905e0e2
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ff29daeb71125f936fa144d45905e0e2

import type { ConcreteRequest } from 'relay-runtime';
export type LocationAutocompleteQuery$variables = {
  searchTerm: string;
};
export type LocationAutocompleteQuery$data = {
  readonly autocompleteLocations: {
    readonly locations: ReadonlyArray<{
      readonly __typename: "LocationAutocompleteSuggestion";
      readonly displayName: string;
      readonly placeId: string;
    }>;
  };
};
export type LocationAutocompleteQuery = {
  response: LocationAutocompleteQuery$data;
  variables: LocationAutocompleteQuery$variables;
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
    "concreteType": "AutocompleteLocationsPayload",
    "kind": "LinkedField",
    "name": "autocompleteLocations",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "LocationAutocompleteSuggestion",
        "kind": "LinkedField",
        "name": "locations",
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
            "name": "placeId",
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
    "name": "LocationAutocompleteQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationAutocompleteQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "ff29daeb71125f936fa144d45905e0e2",
    "metadata": {},
    "name": "LocationAutocompleteQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "bfb0bc9b7fb85e5e02c3c8f090e7bb47";

export default node;
