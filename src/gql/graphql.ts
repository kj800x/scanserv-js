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
  commitGroup: Scalars['Int']['output'];
  createBook: Scalars['ID']['output'];
  deleteBook: Scalars['Boolean']['output'];
  retryScan: Scalars['Int']['output'];
  scan: Scalars['Int']['output'];
};


export type MutationRootCommitGroupArgs = {
  scanIds: Array<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};


export type MutationRootCreateBookArgs = {
  author: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationRootDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRootRetryScanArgs = {
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
  scanId: Scalars['Int']['input'];
};


export type MutationRootScanArgs = {
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED'
}

export type QueryRoot = {
  __typename?: 'QueryRoot';
  books: Array<Book>;
  dividers: Array<ScanDivider>;
  scanners: Array<ScannerInfo>;
  scans: Array<Scan>;
  staleness: Scalars['Int']['output'];
};

export type Scan = {
  __typename?: 'Scan';
  group?: Maybe<ScanGroup>;
  id?: Maybe<Scalars['Int']['output']>;
  path: Scalars['String']['output'];
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
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
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

export type OmnibusQueryVariables = Exact<{ [key: string]: never; }>;


export type OmnibusQuery = { __typename?: 'QueryRoot', dividers: Array<{ __typename?: 'ScanDivider', id?: number | null, ts: any }>, scans: Array<{ __typename?: 'Scan', id?: number | null, path: string, status: string, scannedAt: any, scanner: string, scanParameters: any, group?: { __typename?: 'ScanGroup', id: number, title: string } | null }> };

export type ScanMutationVariables = Exact<{
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
}>;


export type ScanMutation = { __typename?: 'MutationRoot', scan: number };

export type RescanMutationVariables = Exact<{
  name: Scalars['String']['input'];
  parameters: Scalars['String']['input'];
  scanId: Scalars['Int']['input'];
}>;


export type RescanMutation = { __typename?: 'MutationRoot', retryScan: number };

export type AddDividerMutationVariables = Exact<{ [key: string]: never; }>;


export type AddDividerMutation = { __typename?: 'MutationRoot', addDivider: number };

export type CommitGroupMutationVariables = Exact<{
  scanIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  title: Scalars['String']['input'];
}>;


export type CommitGroupMutation = { __typename?: 'MutationRoot', commitGroup: number };


export const OmnibusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"omnibus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dividers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scannedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scanner"}},{"kind":"Field","name":{"kind":"Name","value":"scanParameters"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<OmnibusQuery, OmnibusQueryVariables>;
export const ScanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"scan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"parameters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}}}]}]}}]} as unknown as DocumentNode<ScanMutation, ScanMutationVariables>;
export const RescanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"rescan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"retryScan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"parameters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parameters"}}},{"kind":"Argument","name":{"kind":"Name","value":"scanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanId"}}}]}]}}]} as unknown as DocumentNode<RescanMutation, RescanMutationVariables>;
export const AddDividerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addDivider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addDivider"}}]}}]} as unknown as DocumentNode<AddDividerMutation, AddDividerMutationVariables>;
export const CommitGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"commitGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scanIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commitGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scanIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scanIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}]}}]} as unknown as DocumentNode<CommitGroupMutation, CommitGroupMutationVariables>;