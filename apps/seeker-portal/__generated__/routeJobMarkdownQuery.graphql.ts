/**
 * @generated SignedSource<<2d5ef18b6f34d61187811e6020d5f5e7>>
 * @relayHash 9bd478dc407bc1e5f55ac49536cc2e29
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9bd478dc407bc1e5f55ac49536cc2e29

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type routeJobMarkdownQuery$variables = {
  jobSlug: string;
  slug: string;
};
export type routeJobMarkdownQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"routeJobMarkdownFragment">;
};
export type routeJobMarkdownQuery = {
  response: routeJobMarkdownQuery$data;
  variables: routeJobMarkdownQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobSlug"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v3 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v4 = [
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "website",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "descriptionCleaned",
  "storageKey": null
},
v10 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "jobSlug"
  }
],
v11 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isVisible",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "workMode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    (v7/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "skills",
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
      "name": "minExperience",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxExperience",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "vacancies",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSalaryNegotiable",
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
},
v12 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v2/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeJobMarkdownQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "routeJobMarkdownFragment",
        "selections": [
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": (v10/*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v11/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "Organization",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "args": [
          {
            "kind": "Variable",
            "name": "jobSlug",
            "variableName": "jobSlug"
          },
          (v3/*: any*/)
        ],
        "argumentDefinitions": (v2/*: any*/)
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "routeJobMarkdownQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": (v10/*: any*/),
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v12/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "9bd478dc407bc1e5f55ac49536cc2e29",
    "metadata": {},
    "name": "routeJobMarkdownQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "7eb1d558ebb02c3f84cf7124694d545c";

export default node;
