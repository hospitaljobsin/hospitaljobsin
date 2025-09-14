/**
 * @generated SignedSource<<3dfdb3c3a5b4138f21e44331e9214dcf>>
 * @relayHash 7fcd73f4a9355e77a0e13ac110200a76
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7fcd73f4a9355e77a0e13ac110200a76

import type { ConcreteRequest } from 'relay-runtime';
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
    "id": "7fcd73f4a9355e77a0e13ac110200a76",
    "metadata": {},
    "name": "LocationAutocompleteQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4c56052eabd40edc677cf8fd05f94f54";

export default node;
