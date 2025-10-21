/**
 * Generic paginated response type for list operations.
 * Combines pagination metadata with the actual list data.
 *
 * @template TItem - Type of items in the list
 * @template TListKey - Property name containing the list items
 */
export type Page<TItem, TListKey extends string> = {
  /** Token for fetching the next page of results (undefined if no more pages) */
  nextPageToken?: string;
} & Record<TListKey, TItem[]>;

/**
 * Common options for list/pagination operations.
 */
export interface ListOptions {
  /** Maximum number of items to return per page */
  maxPageSize?: number;
  /** Token from a previous response to fetch the next page */
  pageToken?: string;
}
