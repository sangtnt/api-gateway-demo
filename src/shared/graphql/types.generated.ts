export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export class Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Void: { input: any; output: any; }
};

export class LoginInput {
  emailOrPhoneNumber: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export class LoginOutput {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  userInfo: User;
};

export class Mutation {
  login: LoginOutput;
};


export class MutationLoginArgs {
  input: LoginInput;
};

export class Query {
  ping: Scalars['Boolean']['output'];
};


export class QueryPingArgs {
  input?: InputMaybe<Scalars['String']['input']>;
};

export class User {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  isPhoneNumberVerified?: Maybe<Scalars['Boolean']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
};
