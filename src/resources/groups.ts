import { HttpClient } from "../http";
import type {
  Group,
  GroupMembershipItem,
  GroupMembershipItemsPage,
  GroupRole,
  GroupRolesPage,
  GroupShout,
  JoinRequestItemsPage,
  ListOptions,
} from "../types";

/**
 * API client for Roblox Group endpoints.
 *
 * @see https://create.roblox.com/docs/cloud/reference/Group
 */
export class Groups {
  /**
   * Creates a new Groups API client.
   *
   * @param http - HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves a Roblox group's information by group ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @returns Promise resolving to the groups's data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const group = await client.groups.get('123456789');
   * console.log(group.displayName); // "Roblox"
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/Group#Cloud_GetGroup
   */
  async get(groupId: string): Promise<Group> {
    return this.http.request<Group>(`/cloud/v2/groups/${groupId}`);
  }

  /**
   * List join requests under a group. Supports additional filtering.
   * Supports pagination for large invite-only groups.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param options - List options including pagination and filtering
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @param options.filter - Filter expression (e.g., "user == 'users/156'")
   * @returns Promise resolving to a page of group invite items
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group is not found or other API error occurs
   *
   * @example
   * ```typescript
   * // Get first page of join requests
   * const page1 = await client.groups.listGroupJoinRequests('123456789', {
   *   maxPageSize: 50
   * });
   *
   * // Get next page
   * const page2 = await client.groups.listGroupJoinRequests('123456789', {
   *   pageToken: page1.nextPageToken
   * });
   *
   * // Filter for a specific user
   * const user = await client.groups.listGroupJoinRequests('123456789', {
   *   filter: "user == 'users/156'"
   * });
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupJoinRequest#Cloud_ListGroupJoinRequests
   */
  async listGroupJoinRequests(
    groupId: string,
    options: ListOptions & { filter?: string } = {},
  ): Promise<JoinRequestItemsPage> {
    const searchParams = new URLSearchParams();
    if (options.maxPageSize)
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);
    if (options.filter) searchParams.set("filter", options.filter);

    return this.http.request<JoinRequestItemsPage>(
      `/cloud/v2/groups/${groupId}/join-requests`,
      {
        method: "GET",
        searchParams,
      },
    );
  }

  /**
   * Accept group join request by group ID and join request ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param joinRequestId - The unique join request ID (numeric string)
   * @returns Promise resolving when the join request is accepted
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group or join request is not found or other API error occurs
   *
   * @example
   * ```typescript
   * await client.groups.acceptGroupJoinRequest('123456789', '987654321');
   * console.log('Join request accepted');
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupJoinRequest#Cloud_AcceptGroupJoinRequest
   */
  async acceptGroupJoinRequest(
    groupId: string,
    joinRequestId: string,
  ): Promise<void> {
    await this.http.request(
      `/cloud/v2/groups/${groupId}/join-requests/${joinRequestId}:accept`,
      {
        method: "POST",
      },
    );
  }

  /**
   * Decline group join request by group ID and join request ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param joinRequestId - The unique join request ID (numeric string)
   * @returns Promise resolving when the join request is declined
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group or join request is not found or other API error occurs
   *
   * @example
   * ```typescript
   * await client.groups.declineGroupJoinRequest('123456789', '987654321');
   * console.log('Join request declined');
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupJoinRequest#Cloud_DeclineGroupJoinRequest
   */
  async declineGroupJoinRequest(
    groupId: string,
    joinRequestId: string,
  ): Promise<void> {
    await this.http.request(
      `/cloud/v2/groups/${groupId}/join-requests/${joinRequestId}:decline`,
      {
        method: "POST",
      },
    );
  }

  /**
   * List group members in a group.
   * Supports pagination for high membercounts.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param options - List options for pagination
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @param options.filter - Filter expression (e.g., "role == 'groups/123/roles/7920705'")
   * @returns Promise resolving to a page of group membership items
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const members = await client.groups.listGroupMemberships('123456789');
   * console.log(members)
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupMembership#Cloud_ListGroupMemberships
   */
  async listGroupMemberships(
    groupId: string,
    options: ListOptions & { filter?: string } = {},
  ): Promise<GroupMembershipItemsPage> {
    const searchParams = new URLSearchParams();
    if (options.maxPageSize)
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);
    if (options.filter) searchParams.set("filter", options.filter);

    return this.http.request<GroupMembershipItemsPage>(
      `/cloud/v2/groups/${groupId}/memberships`,
      {
        method: "GET",
        searchParams,
      },
    );
  }

  /**
   * Get group shout by group ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @returns Promise resolving to the group's shout data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const shout = await client.groups.getGroupShout('123456789');
   * console.log(shout.content); // "Welcome to the group!"
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupShout#Cloud_GetGroupShout
   */
  async getGroupShout(groupId: string): Promise<GroupShout> {
    return this.http.request<GroupShout>(`/cloud/v2/groups/${groupId}/shout`);
  }

  /**
   * List group roles by group ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param options - List options for pagination
   * @param options.maxPageSize - Maximum items per page (default set by API)
   * @param options.pageToken - Token from previous response for next page
   * @returns Promise resolving to an array of group roles
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const roles = await client.groups.listGroupRoles('123456789');
   * console.log(roles);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupRole#Cloud_ListGroupRoles
   */
  async listGroupRoles(
    groupId: string,
    options: ListOptions = {},
  ): Promise<GroupRolesPage> {
    const searchParams = new URLSearchParams();

    if (options.maxPageSize)
      searchParams.set("maxPageSize", options.maxPageSize.toString());
    if (options.pageToken) searchParams.set("pageToken", options.pageToken);

    return this.http.request<GroupRolesPage>(
      `/cloud/v2/groups/${groupId}/roles`,
    );
  }

  /**
   * Get group role by group ID and role ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param roleId - The unique role ID (numeric string)
   * @returns Promise resolving to the group's role data
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group or role is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const role = await client.groups.getGroupRole('123456789', '7920705');
   * console.log(role.displayName); // "Admin"
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupRole#Cloud_GetGroupRole
   */
  async getGroupRole(groupId: string, roleId: string): Promise<GroupRole> {
    return this.http.request<GroupRole>(
      `/cloud/v2/groups/${groupId}/roles/${roleId}`,
    );
  }

  /**
   * Update group membership by group ID, membership ID and role ID.
   *
   * @param groupId - The unique group ID (numeric string)
   * @param membershipId - The unique membership ID (numeric string)
   * @param roleId - The unique role ID to assign (numeric string)
   * @returns Promise resolving when the group membership is updated
   * @throws {AuthError} If API key is invalid
   * @throws {OpenCloudError} If the group, membership, or role is not found or other API error occurs
   *
   * @example
   * ```typescript
   * const groupMembership = await client.groups.updateGroupMembership('123456789', '456789123', '7920705');
   * console.log(groupMembership.role);
   * ```
   *
   * @see https://create.roblox.com/docs/cloud/reference/GroupMembership#Cloud_UpdateGroupMembership
   */
  async updateGroupMembership(
    groupId: string,
    membershipId: string,
    roleId: string,
  ): Promise<GroupMembershipItem> {
    return this.http.request<GroupMembershipItem>(
      `/cloud/v2/groups/${groupId}/memberships/${membershipId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          role: `groups/${groupId}/roles/${roleId}`,
        }),
      },
    );
  }
}
