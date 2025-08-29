/**
 * @generated SignedSource<<b82b7864716112216d09495bfbe33abe>>
 * @relayHash e0025bd3aeb7b783415fab9b8782eeec
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e0025bd3aeb7b783415fab9b8782eeec

import type { ConcreteRequest } from 'relay-runtime';
export type sitemapJobsQuery$variables = {
  count: number;
  cursor?: string | null | undefined;
};
export type sitemapJobsQuery$data = {
  readonly jobs: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
      readonly node: {
        readonly createdAt: any;
        readonly id: string;
        readonly organization: {
          readonly bannerUrl: string;
          readonly name: string;
          readonly slug: string;
        };
        readonly slug: string;
        readonly updatedAt: any;
      };
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
  };
};
export type sitemapJobsQuery = {
  response: sitemapJobsQuery$data;
  variables: sitemapJobsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "jobType",
    "value": ([]/*: any*/)
  },
  {
    "kind": "Literal",
    "name": "workMode",
    "value": ([]/*: any*/)
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bannerUrl",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "sitemapJobsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  {
                    "kind": "RequiredField",
                    "field": {
                      "alias": null,
                      "args": null,
                      "concreteType": "Organization",
                      "kind": "LinkedField",
                      "name": "organization",
                      "plural": false,
                      "selections": [
                        (v4/*: any*/),
                        (v7/*: any*/),
                        (v8/*: any*/)
                      ],
                      "storageKey": null
                    },
                    "action": "THROW"
                  }
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          (v10/*: any*/)
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "sitemapJobsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "e0025bd3aeb7b783415fab9b8782eeec",
    "metadata": {},
    "name": "sitemapJobsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "671b667a92360bf0b82a4be0e017a65e";

export default node;
