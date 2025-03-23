/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query CheckConnectivity {\n    __typename\n  }\n": typeof types.CheckConnectivityDocument,
    "\n  query OmnibusQuery {\n    scans {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      group {\n        id\n        title\n      }\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n    dividers {\n      id\n      ts\n    }\n  }\n": typeof types.OmnibusQueryDocument,
    "\n  query Groups($status: String) {\n    groups(status: $status) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n": typeof types.GroupsDocument,
    "\n  query GroupById($id: Int!) {\n    groupById(id: $id) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n": typeof types.GroupByIdDocument,
    "\n  query ScansByGroup($groupId: Int!) {\n    scansByGroup(groupId: $groupId) {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n  }\n": typeof types.ScansByGroupDocument,
    "\n  mutation Scan($name: String!, $parameters: String!, $groupId: Int) {\n    scan(name: $name, parameters: $parameters, groupId: $groupId)\n  }\n": typeof types.ScanDocument,
    "\n  mutation Rescan($scanId: Int!, $name: String!, $parameters: String!) {\n    retryScan(scanId: $scanId, name: $name, parameters: $parameters)\n  }\n": typeof types.RescanDocument,
    "\n  mutation AddDivider {\n    addDivider\n  }\n": typeof types.AddDividerDocument,
    "\n  mutation CommitGroup($scanIds: [Int!]!, $title: String!) {\n    commitGroup(scanIds: $scanIds, title: $title)\n  }\n": typeof types.CommitGroupDocument,
    "\n  mutation CreateGroup($title: String!, $status: String!) {\n    createGroup(title: $title, status: $status)\n  }\n": typeof types.CreateGroupDocument,
    "\n  mutation UpdateGroup(\n    $id: Int!\n    $title: String\n    $status: String\n    $comment: String\n    $tags: [String!]\n  ) {\n    updateGroup(\n      id: $id\n      title: $title\n      status: $status\n      comment: $comment\n      tags: $tags\n    )\n  }\n": typeof types.UpdateGroupDocument,
    "\n  mutation AddScanToGroup($scanId: Int!, $groupId: Int!) {\n    addScanToGroup(scanId: $scanId, groupId: $groupId)\n  }\n": typeof types.AddScanToGroupDocument,
    "\n  mutation RotateScan($scanId: Int!, $rotation: Int!) {\n    rotateScan(scanId: $scanId, rotation: $rotation)\n  }\n": typeof types.RotateScanDocument,
    "\n  mutation CropScan(\n    $scanId: Int!\n    $x: Float!\n    $y: Float!\n    $width: Float!\n    $height: Float!\n  ) {\n    cropScan(scanId: $scanId, x: $x, y: $y, width: $width, height: $height)\n  }\n": typeof types.CropScanDocument,
};
const documents: Documents = {
    "\n  query CheckConnectivity {\n    __typename\n  }\n": types.CheckConnectivityDocument,
    "\n  query OmnibusQuery {\n    scans {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      group {\n        id\n        title\n      }\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n    dividers {\n      id\n      ts\n    }\n  }\n": types.OmnibusQueryDocument,
    "\n  query Groups($status: String) {\n    groups(status: $status) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n": types.GroupsDocument,
    "\n  query GroupById($id: Int!) {\n    groupById(id: $id) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n": types.GroupByIdDocument,
    "\n  query ScansByGroup($groupId: Int!) {\n    scansByGroup(groupId: $groupId) {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n  }\n": types.ScansByGroupDocument,
    "\n  mutation Scan($name: String!, $parameters: String!, $groupId: Int) {\n    scan(name: $name, parameters: $parameters, groupId: $groupId)\n  }\n": types.ScanDocument,
    "\n  mutation Rescan($scanId: Int!, $name: String!, $parameters: String!) {\n    retryScan(scanId: $scanId, name: $name, parameters: $parameters)\n  }\n": types.RescanDocument,
    "\n  mutation AddDivider {\n    addDivider\n  }\n": types.AddDividerDocument,
    "\n  mutation CommitGroup($scanIds: [Int!]!, $title: String!) {\n    commitGroup(scanIds: $scanIds, title: $title)\n  }\n": types.CommitGroupDocument,
    "\n  mutation CreateGroup($title: String!, $status: String!) {\n    createGroup(title: $title, status: $status)\n  }\n": types.CreateGroupDocument,
    "\n  mutation UpdateGroup(\n    $id: Int!\n    $title: String\n    $status: String\n    $comment: String\n    $tags: [String!]\n  ) {\n    updateGroup(\n      id: $id\n      title: $title\n      status: $status\n      comment: $comment\n      tags: $tags\n    )\n  }\n": types.UpdateGroupDocument,
    "\n  mutation AddScanToGroup($scanId: Int!, $groupId: Int!) {\n    addScanToGroup(scanId: $scanId, groupId: $groupId)\n  }\n": types.AddScanToGroupDocument,
    "\n  mutation RotateScan($scanId: Int!, $rotation: Int!) {\n    rotateScan(scanId: $scanId, rotation: $rotation)\n  }\n": types.RotateScanDocument,
    "\n  mutation CropScan(\n    $scanId: Int!\n    $x: Float!\n    $y: Float!\n    $width: Float!\n    $height: Float!\n  ) {\n    cropScan(scanId: $scanId, x: $x, y: $y, width: $width, height: $height)\n  }\n": types.CropScanDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CheckConnectivity {\n    __typename\n  }\n"): (typeof documents)["\n  query CheckConnectivity {\n    __typename\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OmnibusQuery {\n    scans {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      group {\n        id\n        title\n      }\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n    dividers {\n      id\n      ts\n    }\n  }\n"): (typeof documents)["\n  query OmnibusQuery {\n    scans {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      group {\n        id\n        title\n      }\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n    dividers {\n      id\n      ts\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Groups($status: String) {\n    groups(status: $status) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n"): (typeof documents)["\n  query Groups($status: String) {\n    groups(status: $status) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GroupById($id: Int!) {\n    groupById(id: $id) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n"): (typeof documents)["\n  query GroupById($id: Int!) {\n    groupById(id: $id) {\n      id\n      title\n      createdAt\n      updatedAt\n      status\n      comment\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScansByGroup($groupId: Int!) {\n    scansByGroup(groupId: $groupId) {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n  }\n"): (typeof documents)["\n  query ScansByGroup($groupId: Int!) {\n    scansByGroup(groupId: $groupId) {\n      id\n      status\n      path\n      scannedAt\n      scanner\n      rotation\n      cropCoordinates\n      originalPath {\n        path\n      }\n      editedPath {\n        path\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Scan($name: String!, $parameters: String!, $groupId: Int) {\n    scan(name: $name, parameters: $parameters, groupId: $groupId)\n  }\n"): (typeof documents)["\n  mutation Scan($name: String!, $parameters: String!, $groupId: Int) {\n    scan(name: $name, parameters: $parameters, groupId: $groupId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Rescan($scanId: Int!, $name: String!, $parameters: String!) {\n    retryScan(scanId: $scanId, name: $name, parameters: $parameters)\n  }\n"): (typeof documents)["\n  mutation Rescan($scanId: Int!, $name: String!, $parameters: String!) {\n    retryScan(scanId: $scanId, name: $name, parameters: $parameters)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddDivider {\n    addDivider\n  }\n"): (typeof documents)["\n  mutation AddDivider {\n    addDivider\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CommitGroup($scanIds: [Int!]!, $title: String!) {\n    commitGroup(scanIds: $scanIds, title: $title)\n  }\n"): (typeof documents)["\n  mutation CommitGroup($scanIds: [Int!]!, $title: String!) {\n    commitGroup(scanIds: $scanIds, title: $title)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGroup($title: String!, $status: String!) {\n    createGroup(title: $title, status: $status)\n  }\n"): (typeof documents)["\n  mutation CreateGroup($title: String!, $status: String!) {\n    createGroup(title: $title, status: $status)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGroup(\n    $id: Int!\n    $title: String\n    $status: String\n    $comment: String\n    $tags: [String!]\n  ) {\n    updateGroup(\n      id: $id\n      title: $title\n      status: $status\n      comment: $comment\n      tags: $tags\n    )\n  }\n"): (typeof documents)["\n  mutation UpdateGroup(\n    $id: Int!\n    $title: String\n    $status: String\n    $comment: String\n    $tags: [String!]\n  ) {\n    updateGroup(\n      id: $id\n      title: $title\n      status: $status\n      comment: $comment\n      tags: $tags\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddScanToGroup($scanId: Int!, $groupId: Int!) {\n    addScanToGroup(scanId: $scanId, groupId: $groupId)\n  }\n"): (typeof documents)["\n  mutation AddScanToGroup($scanId: Int!, $groupId: Int!) {\n    addScanToGroup(scanId: $scanId, groupId: $groupId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RotateScan($scanId: Int!, $rotation: Int!) {\n    rotateScan(scanId: $scanId, rotation: $rotation)\n  }\n"): (typeof documents)["\n  mutation RotateScan($scanId: Int!, $rotation: Int!) {\n    rotateScan(scanId: $scanId, rotation: $rotation)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CropScan(\n    $scanId: Int!\n    $x: Float!\n    $y: Float!\n    $width: Float!\n    $height: Float!\n  ) {\n    cropScan(scanId: $scanId, x: $x, y: $y, width: $width, height: $height)\n  }\n"): (typeof documents)["\n  mutation CropScan(\n    $scanId: Int!\n    $x: Float!\n    $y: Float!\n    $width: Float!\n    $height: Float!\n  ) {\n    cropScan(scanId: $scanId, x: $x, y: $y, width: $width, height: $height)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;