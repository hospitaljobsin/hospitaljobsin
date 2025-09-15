/**
 * @generated SignedSource<<cd30f290f5254d6adaa4c6f348f0b6ab>>
 * @relayHash aad6a559f637431392d333a90520c8b2
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID aad6a559f637431392d333a90520c8b2

import type { ConcreteRequest } from 'relay-runtime';
export type RegionLevel = "CONTINENT" | "COUNTRY" | "LOCALITY" | "STATE" | "%future added value";
export type LocationAutocompleteQuery$variables = {
  searchTerm: string;
};
export type LocationAutocompleteQuery$data = {
  readonly autocompleteLocations: {
    readonly locations: ReadonlyArray<{
      readonly __typename: "LocationAutocompleteSuggestion";
      readonly address: {
        readonly addressLocality: string | null | undefined;
        readonly addressRegion: string | null | undefined;
        readonly country: string | null | undefined;
        readonly displayName: string | null | undefined;
        readonly postalCode: string | null | undefined;
      };
      readonly level: RegionLevel;
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
            "concreteType": "Address",
            "kind": "LinkedField",
            "name": "address",
            "plural": false,
            "selections": [
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
                "name": "country",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "addressLocality",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "addressRegion",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "postalCode",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "level",
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
    "id": "aad6a559f637431392d333a90520c8b2",
    "metadata": {},
    "name": "LocationAutocompleteQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "8bfafcb5d7f5e3b96bed4aaff91d816b";

export default node;
