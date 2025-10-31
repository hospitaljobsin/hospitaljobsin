/**
 * @generated SignedSource<<63b2e1d88a4173eef072176c772d8ab9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type Currency = "INR" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type JobMapMarkersFragment_data$data = {
  readonly jobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly currency: Currency;
        readonly geo: {
          readonly coordinates: ReadonlyArray<number>;
        } | null | undefined;
        readonly id: string;
        readonly location: string | null | undefined;
        readonly maxSalary: number | null | undefined;
        readonly minSalary: number | null | undefined;
        readonly organization: {
          readonly name: string;
          readonly slug: string;
        } | null | undefined;
        readonly slug: string;
        readonly title: string;
      };
    }>;
  };
  readonly " $fragmentType": "JobMapMarkersFragment_data";
};
export type JobMapMarkersFragment_data$key = {
  readonly " $data"?: JobMapMarkersFragment_data$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobMapMarkersFragment_data">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "bounds"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "jobType"
    },
    {
      "kind": "RootArgument",
      "name": "location"
    },
    {
      "kind": "RootArgument",
      "name": "maxSalary"
    },
    {
      "kind": "RootArgument",
      "name": "minExperience"
    },
    {
      "kind": "RootArgument",
      "name": "minSalary"
    },
    {
      "kind": "RootArgument",
      "name": "proximityKm"
    },
    {
      "kind": "RootArgument",
      "name": "searchTerm"
    },
    {
      "kind": "RootArgument",
      "name": "sortBy"
    },
    {
      "kind": "RootArgument",
      "name": "workMode"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobMapMarkersFragment_data",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "bounds",
          "variableName": "bounds"
        },
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "first"
        },
        {
          "kind": "Variable",
          "name": "jobType",
          "variableName": "jobType"
        },
        {
          "kind": "Variable",
          "name": "location",
          "variableName": "location"
        },
        {
          "kind": "Variable",
          "name": "maxSalary",
          "variableName": "maxSalary"
        },
        {
          "kind": "Variable",
          "name": "minExperience",
          "variableName": "minExperience"
        },
        {
          "kind": "Variable",
          "name": "minSalary",
          "variableName": "minSalary"
        },
        {
          "kind": "Variable",
          "name": "proximityKm",
          "variableName": "proximityKm"
        },
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        {
          "kind": "Variable",
          "name": "sortBy",
          "variableName": "sortBy"
        },
        {
          "kind": "Variable",
          "name": "workMode",
          "variableName": "workMode"
        }
      ],
      "concreteType": "JobConnection",
      "kind": "LinkedField",
      "name": "jobs",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "JobEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Job",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "location",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "minSalary",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "maxSalary",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "currency",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "GeoObject",
                  "kind": "LinkedField",
                  "name": "geo",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "coordinates",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Organization",
                  "kind": "LinkedField",
                  "name": "organization",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "name",
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
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "8a8820772eb715c6eabb849bdf0871a7";

export default node;
