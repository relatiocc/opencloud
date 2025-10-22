import type { Page } from "./common";

export type SocialNetworkProfiles =
  | "facebook"
  | "twitter"
  | "youtube"
  | "twitch"
  | "guilded";
export type SocialNetworkVisibility =
  | "SOCIAL_NETWORK_VISIBILITY_UNSPECIFIED"
  | "NO_ONE"
  | "FRIENDS"
  | "FRIENDS_AND_FOLLOWING"
  | "FRIENDS_FOLLOWING_AND_FOLLOWERS"
  | "EVERYONE";

export interface User {
  path: string;
  createTime: string;
  id: string;
  name: string;
  displayName: string;
  about: string;
  locale: string;
  premium: boolean;
  idVerified?: boolean;
  socialNetworkProfiles?: Partial<Record<SocialNetworkProfiles, string>> & {
    visibility?: SocialNetworkVisibility;
  };
}

export type ThumbnailFormat = "FORMAT_UNSPECIFIED" | "PNG" | "JPEG";
export type ThumbnailShape = "SHAPE_UNSPECIFIED" | "ROUND" | "SQUARE";

export interface GenerateThumbnailOptions {
  size?: number;
  format?: ThumbnailFormat;
  shape?: ThumbnailShape;
}

export interface UserThumbnail {
  response: {
    imageUri: string;
  };
}

export type QuotaType =
  | "QUOTA_TYPE_UNSPECIFIED"
  | "RATE_LIMIT_UPLOAD"
  | "RATE_LIMIT_CREATOR_STORE_DISTRIBUTE";
export type AssetType =
  | "ASSET_TYPE_UNSPECIFIED"
  | "IMAGE"
  | "TSHIRT"
  | "AUDIO"
  | "MESH"
  | "LUA"
  | "HAT"
  | "PLACE"
  | "MODEL"
  | "SHIRT"
  | "PANTS"
  | "DECAL"
  | "HEAD"
  | "FACE"
  | "GEAR"
  | "ANIMATION"
  | "TORSO"
  | "RIGHT_ARM"
  | "LEFT_ARM"
  | "LEFT_LEG"
  | "RIGHT_LEG"
  | "YOUTUBE_VIDEO"
  | "APP"
  | "CODE"
  | "PLUGIN"
  | "SOLID_MODEL"
  | "MESH_PART"
  | "HAIR_ACCESSORY"
  | "FACE_ACCESSORY"
  | "NECK_ACCESSORY"
  | "SHOULDER_ACCESSORY"
  | "FRONT_ACCESSORY"
  | "BACK_ACCESSORY"
  | "WAIST_ACCESSORY"
  | "CLIMB_ANIMATION"
  | "DEATH_ANIMATION"
  | "FALL_ANIMATION"
  | "IDLE_ANIMATION"
  | "JUMP_ANIMATION"
  | "RUN_ANIMATION"
  | "SWIM_ANIMATION"
  | "WALK_ANIMATION"
  | "POSE_ANIMATION"
  | "LOCALIZATION_TABLE_MANIFEST"
  | "LOCALIZATION_TABLE_TRANSLATION"
  | "EMOTE_ANIMATION"
  | "VIDEO"
  | "TEXTURE_PACK"
  | "TSHIRT_ACCESSORY"
  | "SHIRT_ACCESSORY"
  | "PANTS_ACCESSORY"
  | "JACKET_ACCESSORY"
  | "SWEATER_ACCESSORY"
  | "SHORTS_ACCESSORY"
  | "LEFT_SHOE_ACCESSORY"
  | "RIGHT_SHOE_ACCESSORY"
  | "DRESS_SKIRT_ACCESSORY"
  | "FONT_FAMILY"
  | "FONT_FACE"
  | "MESH_HIDDEN_SURFACE_REMOVAL"
  | "EYEBROW_ACCESSORY"
  | "EYELASH_ACCESSORY"
  | "MOOD_ANIMATION"
  | "DYNAMIC_HEAD"
  | "CODE_SNIPPET"
  | "ADS_VIDEO";
export type QuotaPeriod = "PERIOD_UNSPECIFIED" | "MONTH" | "DAY";

export interface AssetQuota {
  path: string;
  quotaType: QuotaType;
  assetType: AssetType;
  usage: number;
  period: QuotaPeriod;
  usageResetTime: string;
}

export type InventoryItemAssetType =
  | "INVENTORY_ITEM_ASSET_TYPE_UNSPECIFIED"
  | "CLASSIC_TSHIRT"
  | "AUDIO"
  | "HAT"
  | "MODEL"
  | "CLASSIC_SHIRT"
  | "CLASSIC_PANTS"
  | "DECAL"
  | "CLASSIC_HEAD"
  | "FACE"
  | "GEAR"
  | "ANIMATION"
  | "TORSO"
  | "RIGHT_ARM"
  | "LEFT_ARM"
  | "LEFT_LEG"
  | "RIGHT_LEG"
  | "PACKAGE"
  | "PLUGIN"
  | "MESH_PART"
  | "HAIR_ACCESSORY"
  | "FACE_ACCESSORY"
  | "NECK_ACCESSORY"
  | "SHOULDER_ACCESSORY"
  | "FRONT_ACCESSORY"
  | "BACK_ACCESSORY"
  | "WAIST_ACCESSORY"
  | "CLIMB_ANIMATION"
  | "DEATH_ANIMATION"
  | "FALL_ANIMATION"
  | "IDLE_ANIMATION"
  | "JUMP_ANIMATION"
  | "RUN_ANIMATION"
  | "SWIM_ANIMATION"
  | "WALK_ANIMATION"
  | "POSE_ANIMATION"
  | "EMOTE_ANIMATION"
  | "VIDEO"
  | "TSHIRT_ACCESSORY"
  | "SHIRT_ACCESSORY"
  | "PANTS_ACCESSORY"
  | "JACKET_ACCESSORY"
  | "SWEATER_ACCESSORY"
  | "SHORTS_ACCESSORY"
  | "LEFT_SHOE_ACCESSORY"
  | "RIGHT_SHOE_ACCESSORY"
  | "DRESS_SKIRT_ACCESSORY"
  | "EYEBROW_ACCESSORY"
  | "EYELASH_ACCESSORY"
  | "MOOD_ANIMATION"
  | "DYNAMIC_HEAD"
  | "CREATED_PLACE"
  | "PURCHASED_PLACE";

export type InstanceState =
  | "COLLECTIBLE_ITEM_INSTANCE_STATE_UNSPECIFIED"
  | "AVAILABLE"
  | "HOLD";

export interface CollectibleDetails {
  itemId: string;
  instanceId: string;
  instanceState: InstanceState;
  serialNumber: number;
}

export interface AssetDetails {
  assetId: string;
  inventoryItemAssetType: InventoryItemAssetType;
  instanceId: string;
  collectibleDetails: CollectibleDetails;
}

export interface BadgeDetails {
  badgeId: string;
}

export interface GamePassDetails {
  gamePassId: string;
}

export interface PrivateServerDetails {
  privateServerId: string;
}

export interface InventoryItem {
  path: string;
  assetDetails?: AssetDetails;
  badgeDetails?: BadgeDetails;
  gamePassDetails?: GamePassDetails;
  privateServerDetails?: PrivateServerDetails;
  addTime: string;
}

export type InventoryItemsPage = Page<InventoryItem, "inventoryItems">;
export type AssetQuotasPage = Page<AssetQuota, "assetQuotas">;

export type NotificationType = "TYPE_UNSPECIFIED" | "MOMENT";

export interface UserNotificationSource {
  universe: string;
}

export interface UserNotificationPayload {
  type: NotificationType;
  messageId: string;
  parameters: Record<string, Record<string, string>>;
  joinExperience: {
    launchData: string;
  };
  analyticsData: {
    category: string;
  };
}

export interface UserNotificationResponse {
  path: string;
  id: string;
}

export interface UserNotificationBody {
  source: UserNotificationSource;
  payload: UserNotificationPayload;
}
