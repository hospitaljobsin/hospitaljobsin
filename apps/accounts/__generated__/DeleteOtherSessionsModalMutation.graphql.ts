/**
 * @generated SignedSource<<335367d99e2aebd06cf755bd49019357>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type DeleteOtherSessionsModalMutation$variables = {
  connections: ReadonlyArray<string>;
};
export type DeleteOtherSessionsModalMutation$data = {
  readonly deleteOtherSessions: {
    readonly deletedSessionIds: ReadonlyArray<string>;
  };
};
export type DeleteOtherSessionsModalMutation = {
  response: DeleteOtherSessionsModalMutation$data;
  variables: DeleteOtherSessionsModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedSessionIds",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteOtherSessionsModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "DeleteOtherSessionsPayload",
        "kind": "LinkedField",
        "name": "deleteOtherSessions",
        "plural": false,
        "selections": [
          (v1/*: any*/)
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
    "name": "DeleteOtherSessionsModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "DeleteOtherSessionsPayload",
        "kind": "LinkedField",
        "name": "deleteOtherSessions",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedSessionIds",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "eb45a3b8070cdd7d075ae4e3a6e39601",
    "id": null,
    "metadata": {},
    "name": "DeleteOtherSessionsModalMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteOtherSessionsModalMutation{deleteOtherSessions{deletedSessionIds}}"
  }
};
})();

(node as any).hash = "616453cc3a6ab533b5845ccca13659c8";

export default node;
