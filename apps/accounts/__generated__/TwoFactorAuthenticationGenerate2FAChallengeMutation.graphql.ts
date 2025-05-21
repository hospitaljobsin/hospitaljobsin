/**
 * @generated SignedSource<<9e4893111c956246320af387d3396936>>
 * @relayHash a1ca9cc8373fc9ba69910594c7f12e2f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a1ca9cc8373fc9ba69910594c7f12e2f

import type { ConcreteRequest } from 'relay-runtime';
export type TwoFactorAuthenticationGenerate2FAChallengeMutation$variables = Record<PropertyKey, never>;
export type TwoFactorAuthenticationGenerate2FAChallengeMutation$data = {
  readonly generateAuthenticator2faChallenge: {
    readonly __typename: "GenerateAuthenticator2FAChallengeSuccess";
    readonly otpUri: string;
    readonly secret: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type TwoFactorAuthenticationGenerate2FAChallengeMutation = {
  response: TwoFactorAuthenticationGenerate2FAChallengeMutation$data;
  variables: TwoFactorAuthenticationGenerate2FAChallengeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "generateAuthenticator2faChallenge",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "otpUri",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "secret",
            "storageKey": null
          }
        ],
        "type": "GenerateAuthenticator2FAChallengeSuccess",
        "abstractKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TwoFactorAuthenticationGenerate2FAChallengeMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TwoFactorAuthenticationGenerate2FAChallengeMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "a1ca9cc8373fc9ba69910594c7f12e2f",
    "metadata": {},
    "name": "TwoFactorAuthenticationGenerate2FAChallengeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "e712e5f3b83295579a0232d64ccef9dc";

export default node;
