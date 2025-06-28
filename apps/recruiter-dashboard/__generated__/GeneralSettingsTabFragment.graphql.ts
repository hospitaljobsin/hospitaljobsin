/**
 * @generated SignedSource<<a6751de20db381341a5071ab20d7eecd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type GeneralSettingsTabFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isAdmin: boolean;
    readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationModalFragment" | "UpdateOrganizationFormFragment">;
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
  readonly " $fragmentType": "GeneralSettingsTabFragment";
};
export type GeneralSettingsTabFragment$key = {
  readonly " $data"?: GeneralSettingsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GeneralSettingsTabFragment">;
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
  "name": "GeneralSettingsTabFragment",
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
              "args": null,
              "kind": "FragmentSpread",
              "name": "UpdateOrganizationFormFragment"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "DeleteOrganizationModalFragment"
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

(node as any).hash = "35db19f8d7419f241419c12b26e0849d";

export default node;
