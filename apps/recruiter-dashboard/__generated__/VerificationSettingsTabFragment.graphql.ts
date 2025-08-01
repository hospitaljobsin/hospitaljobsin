/**
 * @generated SignedSource<<6f13183751d07324a11d61bf7360be66>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type VerificationStatus = "NOT_REQUESTED" | "PENDING" | "REJECTED" | "VERIFIED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type VerificationSettingsTabFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isAdmin: boolean;
    readonly verificationStatus: VerificationStatus;
    readonly verifiedAt: any | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"AlreadyVerifiedFragment" | "PendingVerificationViewFragment" | "RejectedVerificationViewFragment" | "RequestVerificationFormFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly viewer: {
    readonly __typename: "Account";
    readonly sudoModeExpiresAt: any | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationModalAccountFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "VerificationSettingsTabFragment";
};
export type VerificationSettingsTabFragment$key = {
  readonly " $data"?: VerificationSettingsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"VerificationSettingsTabFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "VerificationSettingsTabFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "organization",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAdmin",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "verifiedAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "verificationStatus",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "AlreadyVerifiedFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "RequestVerificationFormFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "PendingVerificationViewFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "RejectedVerificationViewFragment"
            }
          ],
          "type": "Organization",
          "abstractKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "sudoModeExpiresAt",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "DeleteOrganizationModalAccountFragment"
            }
          ],
          "type": "Account",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "7140b976e4e3540589347069b7853f8e";

export default node;
