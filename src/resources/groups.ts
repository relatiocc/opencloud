import { HttpClient } from "../http";
import type {
  Group,
  GroupMembershipItemsPage,
  JoinRequestItemsPage,
  ListOptions,
} from "../types";

/**
 * API client for Roblox Group endpoints.
 * Provides methods to retrieve group information, shouts, and group memberships.
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
   *
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
}
