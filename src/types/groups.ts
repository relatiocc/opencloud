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

export interface GroupShout {
  path: string;
  createTime: string;
  updateTime: string;
  content: string;
  poster: string;
}

export interface GroupPermissions {
  viewWallPosts: boolean;
  createWallPosts: boolean;
  deleteWallPosts: boolean;
  viewGroupShout: boolean;
  createGroupShout: boolean;
  changeRank: boolean;
  acceptRequests: boolean;
  exileMembers: boolean;
  manageRelationships: boolean;
  viewAuditLog: boolean;
  spendGroupFunds: boolean;
  advertiseGroup: boolean;
  createAvatarItems: boolean;
  manageAvatarItems: boolean;
  manageGroupUniverses: boolean;
  viewUniverseAnalytics: boolean;
  createApiKeys: boolean;
  manageApiKeys: boolean;
  banMembers: boolean;
  viewForums: boolean;
  manageCategories: boolean;
  createPosts: boolean;
  lockPosts: boolean;
  pinPosts: boolean;
  removePosts: boolean;
  createComments: boolean;
  removeComments: boolean;
  manageBlockedWords: boolean;
  viewBlockedWords: boolean;
}

export interface GroupRole {
  path: string;
  createTime: string;
  updateTime: string;
  id: string;
  displayName: string;
  description: string;
  rank: number;
  memberCount: number;
  permissions: GroupPermissions[];
}

export type GroupRolesPage = Page<GroupRole, "groupRoles">;
export type GroupMembershipItemsPage = Page<
  GroupMembershipItem,
  "groupMemberships"
>;
export type JoinRequestItemsPage = Page<JoinRequestItem, "groupJoinRequests">;
