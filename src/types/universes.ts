import { Page } from "./common";

export interface Universe {
  path: string;
  createTime: string;
  updateTime: string;
  displayName: string;
  description: string;
  owner: Owner;
  visibility: Visibility;
  facebookSocialLink: SocialLink;
  twitterSocialLink: SocialLink;
  youtubeSocialLink: SocialLink;
  twitchSocialLink: SocialLink;
  discordSocialLink: SocialLink;
  robloxGroupSocialLink: SocialLink;
  guildedSocialLink: SocialLink;
  voiceChatEnabled: boolean;
  ageRating: AgeRating;
  privateServerPriceRobux: number;
  desktopEnabled: boolean;
  mobileEnabled: boolean;
  tabletEnabled: boolean;
  consoleEnabled: boolean;
  vrEnabled: boolean;
}

export interface UniverseBody {
  facebookSocialLink?: SocialLink;
  twitterSocialLink?: SocialLink;
  youtubeSocialLink?: SocialLink;
  twitchSocialLink?: SocialLink;
  discordSocialLink?: SocialLink;
  robloxGroupSocialLink?: SocialLink;
  guildedSocialLink?: SocialLink;
  voiceChatEnabled?: boolean;
  privateServerPriceRobux?: number;
  desktopEnabled?: boolean;
  mobileEnabled?: boolean;
  tabletEnabled?: boolean;
  consoleEnabled?: boolean;
  vrEnabled?: boolean;
}

export interface SocialLink {
  title: string;
  uri: string;
}

export interface SpeechAssetOperation {
  path: string;
  done: boolean;
}

export interface SpeechAssetBody {
  text: string;
  speechStyle: {
    voiceId: string;
    pitch: number;
    speed: number;
  };
}

export interface SpeechAssetResponse extends SpeechAssetOperation {
  operationId: string;
  response: {
    path: string;
    revisionId: string;
    revisionCreateTime: string;
    assetId: string;
    displayName: string;
    description: string;
    assetType: string;
    creationContext: {
      creator: {
        userId?: string;
        groupId?: string;
      };
    };
    moderationResult: {
      moderationState: "Reviewing" | "Rejected" | "Approved";
    };
    state: string;
  };
}

export interface GameJoinRestriction {
  active: boolean;
  duration: string;
  privateReason: string;
  displayReason: string;
  excludeAltAccounts: boolean;
}

export interface GameJoinRestrictionResponse extends GameJoinRestriction {
  startTime: string;
  inherited: boolean;
}

export interface UserRestriction {
  path: string;
  updateTime: string;
  user: string;
  gameJoinRestriction: GameJoinRestrictionResponse;
}

export interface UserRestrictionLog extends GameJoinRestriction {
  user: string;
  place: string;
  moderator: {
    robloxUser: string;
  };
  createTime: string;
  startTime: string;
  restrictionType: {
    gameJoinRestriction: object;
  };
}

export interface PublishMessageBody {
  topic: string;
  message: string;
}

export interface TranslateTextBody {
  text: string;
  sourceLanguageCode: LanguageCode;
  targetLanguageCodes: LanguageCode[];
}

export interface TranslateTextResponse {
  sourceLanguageCode: LanguageCode;
  translations: Partial<Record<LanguageCode, string>>;
}

export type UserRestrictionPage = Page<UserRestriction, "userRestrictions">;
export type UserRestrictionLogPage = Page<UserRestrictionLog, "logs">;
export type Owner = "user" | "group";
export type Visibility = "VISIBILITY_UNSPECIFIED" | "PUBLIC" | "PRIVATE";
export type AgeRating =
  | "AGE_RATING_UNSPECIFIED"
  | "AGE_RATING_ALL"
  | "AGE_RATING_9_PLUS"
  | "AGE_RATING_13_PLUS"
  | "AGE_RATING_17_PLUS";
export type LanguageCode =
  | "en-us"
  | "fr-fr"
  | "vi-vn"
  | "th-th"
  | "tr-tr"
  | "ru-ru"
  | "es-es"
  | "pt-br"
  | "ko-kr"
  | "ja-jp"
  | "zh-cn"
  | "zh-tw"
  | "de-de"
  | "pl-pl"
  | "it-it"
  | "id-id"
  | "";
