/**
 * @generated SignedSource<<cabba6bc8f61ab434ed46016c2c72043>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CompanyDetailViewQuery$variables = {
  slug: string;
};
export type CompanyDetailViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CompanyDetailsFragment" | "CompanyJobsListFragment">;
};
export type CompanyDetailViewQuery = {
  response: CompanyDetailViewQuery$data;
  variables: CompanyDetailViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v5 = {
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
      "name": "city",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": (v6/*: any*/),
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
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isSaved",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slug",
              "storageKey": null
            },
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
              "name": "type",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "workMode",
              "storageKey": null
            },
            (v5/*: any*/),
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
              "name": "hasSalaryRange",
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
              "name": "hasExperienceRange",
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
              "name": "createdAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Company",
              "kind": "LinkedField",
              "name": "company",
              "plural": false,
              "selections": [
                (v3/*: any*/),
                (v4/*: any*/),
                (v5/*: any*/),
                (v7/*: any*/)
              ],
              "storageKey": null
            },
            (v2/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "cursor",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
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
    }
  ],
  "storageKey": "jobs(first:10)"
},
v9 = {
  "kind": "InlineFragment",
  "selections": [
    (v7/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CompanyDetailViewQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "CompanyDetailsFragment"
      },
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "CompanyJobsListFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CompanyDetailViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "website",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "phone",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "email",
                "storageKey": null
              },
              (v5/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": (v6/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "CompanyJobsListInternalFragment_jobs",
                "kind": "LinkedHandle",
                "name": "jobs"
              },
              (v7/*: any*/)
            ],
            "type": "Company",
            "abstractKey": null
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      },
      (v8/*: any*/),
      {
        "alias": null,
        "args": (v6/*: any*/),
        "filters": [
          "searchTerm"
        ],
        "handle": "connection",
        "key": "JobListFragment_jobs",
        "kind": "LinkedHandle",
        "name": "jobs"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isViewerPayload"
          },
          (v9/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "772ec6dde39ff394277c657727e2e8d7",
    "id": null,
    "metadata": {},
    "name": "CompanyDetailViewQuery",
    "operationKind": "query",
    "text": "query CompanyDetailViewQuery(\n  $slug: String!\n) {\n  ...CompanyDetailsFragment_20J5Pl\n  ...CompanyJobsListFragment_20J5Pl\n}\n\nfragment CompanyDetailsFragment_20J5Pl on Query {\n  company(slug: $slug) {\n    __typename\n    ... on Company {\n      ...CompanyDetailsInternalFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment CompanyDetailsInternalFragment on Company {\n  name\n  logoUrl\n  description\n  website\n  phone\n  email\n  address {\n    city\n    state\n  }\n}\n\nfragment CompanyJobsListFragment_20J5Pl on Query {\n  company(slug: $slug) {\n    __typename\n    ... on Company {\n      ...CompanyJobsListInternalFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  ...JobListInternalFragment\n  viewer {\n    __typename\n    ...JobControlsAuthFragment\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment CompanyJobsListInternalFragment on Company {\n  jobs(first: 10) {\n    edges {\n      node {\n        id\n        ...JobFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  id\n}\n\nfragment JobControlsAuthFragment on ViewerPayload {\n  __isViewerPayload: __typename\n  __typename\n}\n\nfragment JobControlsFragment on Job {\n  id\n  isSaved\n  slug\n  ...ShareJobModalFragment\n}\n\nfragment JobFragment on Job {\n  ...JobControlsFragment\n  slug\n  title\n  type\n  workMode\n  address {\n    city\n    state\n  }\n  skills\n  currency\n  hasSalaryRange\n  minSalary\n  maxSalary\n  hasExperienceRange\n  minExperience\n  maxExperience\n  createdAt\n  company {\n    name\n    logoUrl\n    address {\n      city\n      state\n    }\n    id\n  }\n}\n\nfragment JobListInternalFragment on Query {\n  jobs(first: 10) {\n    edges {\n      node {\n        id\n        ...JobFragment\n        ...JobControlsFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nfragment ShareJobModalFragment on Job {\n  slug\n  title\n}\n"
  }
};
})();

(node as any).hash = "8a168b63d29a8b3b8af1263c2b46ddb3";

export default node;
