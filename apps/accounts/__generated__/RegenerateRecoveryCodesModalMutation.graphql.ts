/**
 * @generated SignedSource<<bd5ff4b93b25b2669d4da6c14bf600b1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type RegenerateRecoveryCodesModalMutation$variables = Record<PropertyKey, never>;
export type RegenerateRecoveryCodesModalMutation$data = {
  readonly generate2faRecoveryCodes: {
    readonly __typename: "Generate2FARecoveryCodesSuccess";
    readonly recoveryCodes: ReadonlyArray<string>;
  } | {
    readonly __typename: "TwoFactorAuthenticationNotEnabledError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type RegenerateRecoveryCodesModalMutation = {
  response: RegenerateRecoveryCodesModalMutation$data;
  variables: RegenerateRecoveryCodesModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "generate2faRecoveryCodes",
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
            "name": "recoveryCodes",
            "storageKey": null
          }
        ],
        "type": "Generate2FARecoveryCodesSuccess",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "message",
            "storageKey": null
          }
        ],
        "type": "TwoFactorAuthenticationNotEnabledError",
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
    "name": "RegenerateRecoveryCodesModalMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RegenerateRecoveryCodesModalMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "3420d698bd61cc79b0a592c83389640c",
    "id": null,
    "metadata": {},
    "name": "RegenerateRecoveryCodesModalMutation",
    "operationKind": "mutation",
    "text": "mutation RegenerateRecoveryCodesModalMutation{generate2faRecoveryCodes{__typename,...on Generate2FARecoveryCodesSuccess{recoveryCodes},...on TwoFactorAuthenticationNotEnabledError{message}}}"
  }
};
})();

(node as any).hash = "01fc1b7f42df703f78e93354c7e625be";

export default node;
