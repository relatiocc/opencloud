import type { Page } from "./common";

export interface Group {
  path: string;
  createTime: string;
  updateTime: string;
  id: string;
  displayName: string;
  description: string;
  owner: string;
  memberCount: number;
  publicEntryAllowed: boolean;
  locked: boolean;
  verified: boolean;
}

export interface GroupMembershipItem {
  path: string;
  createTime: string;
  updateTime: string;
  user: string;
  role: string;
}

export interface JoinRequestItem {
  path: string;
  createTime: string;
  user: string;
}

export type GroupMembershipItemsPage = Page<
  GroupMembershipItem,
  "groupMemberships"
>;
export type JoinRequestItemsPage = Page<JoinRequestItem, "groupJoinRequests">;
