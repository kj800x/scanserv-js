/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: { input: any; output: any; }
  /** A scalar that can represent any JSON Object value. */
  JSONObject: { input: any; output: any; }
};

export type AssetPath = {
  __typename?: 'AssetPath';
  path: Scalars['String']['output'];
};

export type Book = {
  __typename?: 'Book';
  author: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type BookChanged = {
  __typename?: 'BookChanged';
  book?: Maybe<Book>;
  id: Scalars['ID']['output'];
  mutationType: MutationType;
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addDivider: Scalars['Int']['output'];
  addScanToGroup: Scalars['Boolean']['output'];
  commitGroup: Scalars['Int']['output'];
  createBook: Scalars['ID']['output'];
  createGroup: Scalars['Int']['output'];
  cropScan: Scalars['Boolean']['output'];
  deleteBook: Scalars['Boolean']['output'];
  retryScan: Scalars['Int']['output'];
  rotateScan: Scalars['Boolean']['output'];
  scan: Scalars['Int']['output'];
  updateGroup: Scalars['Boolean']['output'];
};


export type MutationRootAddScanToGroupArgs = {
  groupId: Scalars['Int']['input'];
  scanId: Scalars['Int']['input'];
};


export type MutationRootCommitGroupArgs = {
  scanIds: Array<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};


export type MutationRootCreateBookArgs = {
  author: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationRootCreateGroupArgs = {
  status: Scalars['String']['input'];
};


export type MutationRootCropScanArgs = {
  height: Scalars['Float']['input'];
  scanId: Scalars['Int']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};


export type MutationRootDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRootRetryScanArgs = {
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
  scanId: Scalars['Int']['input'];
};


export type MutationRootRotateScanArgs = {
  rotation: Scalars['Int']['input'];
  scanId: Scalars['Int']['input'];
};


export type MutationRootScanArgs = {
  groupId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
};


export type MutationRootUpdateGroupArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED'
}

export type QueryRoot = {
  __typename?: 'QueryRoot';
  books: Array<Book>;
  dividers: Array<ScanDivider>;
  groupById?: Maybe<ScanGroup>;
  groups: Array<ScanGroup>;
  incompleteGroups: Array<ScanGroup>;
  scanners: Array<ScannerInfo>;
  scans: Array<Scan>;
  scansByGroup: Array<Scan>;
  staleness: Scalars['Int']['output'];
};


export type QueryRootGroupByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRootGroupsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRootScansByGroupArgs = {
  groupId: Scalars['Int']['input'];
};

export type Scan = {
  __typename?: 'Scan';
  cropCoordinates?: Maybe<Scalars['String']['output']>;
  editedPath?: Maybe<AssetPath>;
  group?: Maybe<ScanGroup>;
  id?: Maybe<Scalars['Int']['output']>;
  originalPath?: Maybe<AssetPath>;
  path: Scalars['String']['output'];
  rotation: Scalars['Int']['output'];
  scanParameters: Scalars['JSONObject']['output'];
  scannedAt: Scalars['DateTime']['output'];
  scanner: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type ScanDivider = {
  __typename?: 'ScanDivider';
  id?: Maybe<Scalars['Int']['output']>;
  ts: Scalars['DateTime']['output'];
};

export type ScanGroup = {
  __typename?: 'ScanGroup';
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  scans: Array<Scan>;
  status: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ScannerInfo = {
  __typename?: 'ScannerInfo';
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  books: BookChanged;
  interval: Scalars['Int']['output'];
};


export type SubscriptionRootBooksArgs = {
  mutationType?: InputMaybe<MutationType>;
};


export type SubscriptionRootIntervalArgs = {
  n?: Scalars['Int']['input'];
};

export type CheckConnectivityQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckConnectivityQuery = { __typename: 'QueryRoot' };

export type OmnibusQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type OmnibusQueryQuery = { __typename?: 'QueryRoot', incompleteGroups: Array<{ __typename?: 'ScanGroup', id: number, title?: string | null, comment: string, createdAt: any, status: string, tags: Array<string>, updatedAt: any, scans: Array<{ __typename?: 'Scan', id?: number | null, status: string, path: string, scannedAt: any, scanner: string, rotation: number, cropCoordinates?: string | null, scanParameters: any, originalPath?: { __typename?: 'AssetPath', path: string } | null, editedPath?: { __typename?: 'AssetPath', path: string } | null }> }> };

export type GroupsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GroupsQuery = { __typename?: 'QueryRoot', groups: Array<{ __typename?: 'ScanGroup', id: number, title?: string | null, comment: string, createdAt: any, status: string, tags: Array<string>, updatedAt: any, scans: Array<{ __typename?: 'Scan', id?: number | null, status: string, path: string, scannedAt: any, scanner: string, rotation: number, cropCoordinates?: string | null, scanParameters: any, originalPath?: { __typename?: 'AssetPath', path: string } | null, editedPath?: { __typename?: 'AssetPath', path: string } | null }> }> };

export type GroupByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GroupByIdQuery = { __typename?: 'QueryRoot', groupById?: { __typename?: 'ScanGroup', id: number, title?: string | null, createdAt: any, updatedAt: any, status: string, comment: string, tags: Array<string> } | null };

export type ScansByGroupQueryVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type ScansByGroupQuery = { __typename?: 'QueryRoot', scansByGroup: Array<{ __typename?: 'Scan', id?: number | null, status: string, path: string, scannedAt: any, scanner: string, rotation: number, cropCoordinates?: string | null, originalPath?: { __typename?: 'AssetPath', path: string } | null, editedPath?: { __typename?: 'AssetPath', path: string } | null }> };

export type ScanMutationVariables = Exact<{
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
  groupId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ScanMutation = { __typename?: 'MutationRoot', scan: number };

export type RescanMutationVariables = Exact<{
  scanId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
}>;


export type RescanMutation = { __typename?: 'MutationRoot', retryScan: number };

export type CommitGroupMutationVariables = Exact<{
  scanIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  title: Scalars['String']['input'];
}>;


export type CommitGroupMutation = { __typename?: 'MutationRoot', commitGroup: number };

export type CreateGroupMutationVariables = Exact<{
  status: Scalars['String']['input'];
}>;


export type CreateGroupMutation = { __typename?: 'MutationRoot', createGroup: number };

export type UpdateGroupMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateGroupMutation = { __typename?: 'MutationRoot', updateGroup: boolean };

export type AddScanToGroupMutationVariables = Exact<{
  scanId: Scalars['Int']['input'];
  groupId: Scalars['Int']['input'];
}>;


export type AddScanToGroupMutation = { __typename?: 'MutationRoot', addScanToGroup: boolean };

export type RotateScanMutationVariables = Exact<{
  scanId: Scalars['Int']['input'];
  rotation: Scalars['Int']['input'];
}>;


export type RotateScanMutation = { __typename?: 'MutationRoot', rotateScan: boolean };

export type CropScanMutationVariables = Exact<{
  scanId: Scalars['Int']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
  width: Scalars['Float']['input'];
  height: Scalars['Float']['input'];
}>;


export type CropScanMutation = { __typename?: 'MutationRoot', cropScan: boolean };

export type ScannersQueryVariables = Exact<{ [key: string]: never; }>;


export type ScannersQuery = { __typename?: 'QueryRoot', scanners: Array<{ __typename?: 'ScannerInfo', name: string, description: string }> };


export const CheckConnectivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckConnectivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]} as unknown as DocumentNode<CheckConnectivityQuery, CheckConnectivityQueryVariables>;
export const OmnibusQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OmnibusQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incompleteGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"scannedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scanner"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"cropCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"scanParameters"}},{"kind":"Field","name":{"kind":"Name","value":"originalPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OmnibusQueryQuery, OmnibusQueryQueryVariables>;
export const GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Groups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"scannedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scanner"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"cropCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"scanParameters"}},{"kind":"Field","name":{"kind":"Name","value":"originalPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>;
export const GroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<GroupByIdQuery, GroupByIdQueryVariables>;
export const ScansByGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScansByGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scansByGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"scannedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scanner"}},{"kind":"Field","name":{"kind":"Name","value":"rotation"}},{"kind":"Field","name":{"kind":"Name","value":"cropCoordinates"}},{"kind":"Field","name":{"kind":"Name","value":"originalPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editedPath"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<ScansByGroupQuery, ScansByGroupQueryVariables>;
export const ScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Scan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"parameters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}]}}]} as unknown as DocumentNode<ScanMutation, ScanMutationVariables>;
export const RescanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Rescan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"retryScan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"parameters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}}}]}]}}]} as unknown as DocumentNode<RescanMutation, RescanMutationVariables>;
export const CommitGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommitGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commitGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scanIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}]}}]} as unknown as DocumentNode<CommitGroupMutation, CommitGroupMutationVariables>;
export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const UpdateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"comment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tags"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"comment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"comment"}}},{"kind":"Argument","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tags"}}}]}]}}]} as unknown as DocumentNode<UpdateGroupMutation, UpdateGroupMutationVariables>;
export const AddScanToGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddScanToGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addScanToGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}]}}]} as unknown as DocumentNode<AddScanToGroupMutation, AddScanToGroupMutationVariables>;
export const RotateScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RotateScan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rotation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rotateScan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"rotation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rotation"}}}]}]}}]} as unknown as DocumentNode<RotateScanMutation, RotateScanMutationVariables>;
export const CropScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CropScan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"x"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"y"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"width"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"height"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cropScan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"x"},"value":{"kind":"Variable","name":{"kind":"Name","value":"x"}}},{"kind":"Argument","name":{"kind":"Name","value":"y"},"value":{"kind":"Variable","name":{"kind":"Name","value":"y"}}},{"kind":"Argument","name":{"kind":"Name","value":"width"},"value":{"kind":"Variable","name":{"kind":"Name","value":"width"}}},{"kind":"Argument","name":{"kind":"Name","value":"height"},"value":{"kind":"Variable","name":{"kind":"Name","value":"height"}}}]}]}}]} as unknown as DocumentNode<CropScanMutation, CropScanMutationVariables>;
export const ScannersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Scanners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scanners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<ScannersQuery, ScannersQueryVariables>;