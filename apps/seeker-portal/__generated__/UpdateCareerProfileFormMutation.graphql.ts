/**
 * @generated SignedSource<<af007b539e75b264432dd4dbfcb4c588>>
 * @relayHash 293393572f0783e6b2560f5abffebd44
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 293393572f0783e6b2560f5abffebd44

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationInput = {
  certificationUrl: string;
  createdAt: any;
  expiresAt?: any | null | undefined;
  issuer: string;
  name: string;
};
export type UpdateCareerProfileFormMutation$variables = {
  certifications: ReadonlyArray<CertificationInput>;
};
export type UpdateCareerProfileFormMutation$data = {
  readonly updateProfileCertifications: {
    readonly profile?: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateCareerProfileFormFragment">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"IncompleteProfileBannerFragment" | "ResumeProgressAccountFragment">;
  };
};
export type UpdateCareerProfileFormMutation = {
  response: UpdateCareerProfileFormMutation$data;
  variables: UpdateCareerProfileFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "certifications"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "certifications",
    "variableName": "certifications"
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateCareerProfileFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileCertifications",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "IncompleteProfileBannerFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ResumeProgressAccountFragment"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateCareerProfileFormFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateCareerProfileFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateProfileCertifications",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isComplete",
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Certification",
                    "kind": "LinkedField",
                    "name": "certifications",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "issuer",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "certificationUrl",
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
                        "name": "expiresAt",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "293393572f0783e6b2560f5abffebd44",
    "metadata": {},
    "name": "UpdateCareerProfileFormMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "3c313b995fb0bdf3f8a5168973035a31";

export default node;
