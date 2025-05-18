/**
 * @generated SignedSource<<16f871022fad23112fcf237bbb79355a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageJobApplyViewQuery$variables = {
  jobSlug: string;
  slug: string;
};
export type pageJobApplyViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobApplyViewClientComponentFragment" | "pageJobApplyMetadataFragment">;
};
export type pageJobApplyViewQuery = {
  response: pageJobApplyViewQuery$data;
  variables: pageJobApplyViewQuery$variables;
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
  "name": "logoUrl",
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "jobSlug"
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isApplied",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "externalApplicationUrl",
  "storageKey": null
},
v12 = [
  {
    "kind": "Variable",
    "name": "jobSlug",
    "variableName": "jobSlug"
  },
  (v3/*: any*/)
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v15 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v2/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageJobApplyViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageJobApplyMetadataFragment",
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
                  {
                    "alias": null,
                    "args": (v7/*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v11/*: any*/)
                        ],
                        "type": "Job",
                        "abstractKey": null
                      }
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
        "args": (v12/*: any*/),
        "argumentDefinitions": (v2/*: any*/)
      },
      {
        "args": (v12/*: any*/),
        "kind": "FragmentSpread",
        "name": "JobApplyViewClientComponentFragment"
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
    "name": "pageJobApplyViewQuery",
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
              {
                "alias": null,
                "args": (v7/*: any*/),
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "JobApplicationForm",
                        "kind": "LinkedField",
                        "name": "applicationForm",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ApplicationField",
                            "kind": "LinkedField",
                            "name": "fields",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fieldName",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "defaultValue",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isRequired",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v13/*: any*/)
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
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          (v14/*: any*/),
                          (v13/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v15/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v15/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "061d9e542e774d0c7acc80f59f079918",
    "id": null,
    "metadata": {},
    "name": "pageJobApplyViewQuery",
    "operationKind": "query",
    "text": "query pageJobApplyViewQuery($slug:String!,$jobSlug:String!){...pageJobApplyMetadataFragment_4lHzkn,...JobApplyViewClientComponentFragment_4lHzkn}fragment JobApplyFormFragment on Job{id,slug,title,applicationForm{fields{fieldName,defaultValue,isRequired},id},organization{name,logoUrl,slug,id}}fragment JobApplyViewClientComponentFragment_4lHzkn on Query{...JobApplyViewFragment_4lHzkn}fragment JobApplyViewFragment_4lHzkn on Query{organization(slug:$slug){__typename,...on Organization{job(slug:$jobSlug){__typename,...on Job{...JobApplyFormFragment},...on Node{__isNode:__typename,id}}},...on Node{__isNode:__typename,id}}}fragment pageJobApplyMetadataFragment_4lHzkn on Query{organization(slug:$slug){__typename,...on Organization{logoUrl,job(slug:$jobSlug){__typename,...on Job{title,description,isApplied,externalApplicationUrl},...on Node{__isNode:__typename,id}}},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "88a1f58d09b6eb8bb5bdd2fa5e11fbb6";

export default node;
