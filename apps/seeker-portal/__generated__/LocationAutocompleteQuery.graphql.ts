/**
 * @generated SignedSource<<1cfa7d9fee14c2c5ffa4c397f8a2b41d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type LocationAutocompleteQuery$variables = {
  searchTerm: string;
};
export type LocationAutocompleteQuery$data = {
  readonly searchLocations: {
    readonly locations: ReadonlyArray<{
      readonly __typename: "SearchLocation";
      readonly coordinates: {
        readonly latitude: number;
        readonly longitude: number;
      };
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
    "concreteType": "SearchLocationsPayload",
    "kind": "LinkedField",
    "name": "searchLocations",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "SearchLocation",
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
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Coordinates",
            "kind": "LinkedField",
            "name": "coordinates",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "latitude",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "longitude",
                "storageKey": null
              }
            ],
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
    "cacheID": "4241a8ceffd82c5f8eb1cf9034e69e5b",
    "id": null,
    "metadata": {},
    "name": "LocationAutocompleteQuery",
    "operationKind": "query",
    "text": "query LocationAutocompleteQuery(\n  $searchTerm: String!\n) {\n  searchLocations(searchTerm: $searchTerm) {\n    locations {\n      __typename\n      displayName\n      placeId\n      coordinates {\n        latitude\n        longitude\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3100963f5f1ae2c286d838639a27febc";

export default node;
