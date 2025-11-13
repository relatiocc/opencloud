import { describe, it, expect } from "vitest";
import { OpenCloud } from "../src";
import { makeFetchMock } from "./_utils";
import type {
  Universe,
  UserRestrictionPage,
  UserRestriction,
  UserRestrictionLogPage,
  GameJoinRestriction,
  SpeechAssetBody,
  SpeechAssetOperation,
  SpeechAssetResponse,
  PublishMessageBody,
  TranslateTextBody,
  TranslateTextResponse,
} from "../src/types";

const baseUrl = "https://apis.roblox.com";

describe("Universes", () => {
  it("GET /universes/{id}", async () => {
    const mockUniverse: Universe = {
      path: "universes/123456789",
      createTime: "2020-01-15T10:30:00.000Z",
      updateTime: "2024-10-15T12:00:00.000Z",
      displayName: "Test Universe",
      description: "This is a test universe for unit testing",
      owner: "user",
      visibility: "PUBLIC",
      facebookSocialLink: {
        title: "Facebook",
        uri: "https://facebook.com/test",
      },
      twitterSocialLink: { title: "Twitter", uri: "https://twitter.com/test" },
      youtubeSocialLink: { title: "YouTube", uri: "https://youtube.com/test" },
      twitchSocialLink: { title: "Twitch", uri: "https://twitch.tv/test" },
      discordSocialLink: { title: "Discord", uri: "https://discord.gg/test" },
      robloxGroupSocialLink: {
        title: "Group",
        uri: "https://roblox.com/groups/123",
      },
      guildedSocialLink: { title: "Guilded", uri: "https://guilded.gg/test" },
      voiceChatEnabled: true,
      ageRating: "AGE_RATING_13_PLUS",
      privateServerPriceRobux: 100,
      desktopEnabled: true,
      mobileEnabled: true,
      tabletEnabled: true,
      consoleEnabled: false,
      vrEnabled: false,
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUniverse },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.universes.get("123456789");

    expect(result.displayName).toBe("Test Universe");
    expect(result.voiceChatEnabled).toBe(true);
    expect(result.desktopEnabled).toBe(true);
    expect(result.privateServerPriceRobux).toBe(100);
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789`,
    );
  });

  it("PATCH /universes/{id}", async () => {
    const mockUniverse: Universe = {
      path: "universes/123456789",
      createTime: "2020-01-15T10:30:00.000Z",
      updateTime: "2024-10-15T12:00:00.000Z",
      displayName: "Test Universe",
      description: "Updated description",
      owner: "user",
      visibility: "PUBLIC",
      facebookSocialLink: { title: "", uri: "" },
      twitterSocialLink: { title: "", uri: "" },
      youtubeSocialLink: { title: "", uri: "" },
      twitchSocialLink: { title: "", uri: "" },
      discordSocialLink: { title: "", uri: "" },
      robloxGroupSocialLink: { title: "", uri: "" },
      guildedSocialLink: { title: "", uri: "" },
      voiceChatEnabled: false,
      ageRating: "AGE_RATING_13_PLUS",
      privateServerPriceRobux: 200,
      desktopEnabled: false,
      mobileEnabled: true,
      tabletEnabled: true,
      consoleEnabled: true,
      vrEnabled: true,
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUniverse },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.universes.update("123456789", {
      voiceChatEnabled: false,
      desktopEnabled: false,
      privateServerPriceRobux: 200,
      consoleEnabled: true,
      vrEnabled: true,
    });

    expect(result.voiceChatEnabled).toBe(false);
    expect(result.desktopEnabled).toBe(false);
    expect(result.privateServerPriceRobux).toBe(200);
    expect(result.consoleEnabled).toBe(true);
    expect(result.vrEnabled).toBe(true);

    const url = calls[0]?.url.toString();
    expect(url).toContain(`${baseUrl}/cloud/v2/universes/123456789`);
    expect(url).toContain("updateMask=");
    expect(calls[0]?.init?.method).toBe("PATCH");
  });

  it("GET /universes/{id}/user-restrictions without options", async () => {
    const mockUserRestrictions: UserRestrictionPage = {
      userRestrictions: [
        {
          path: "universes/123456789/user-restrictions/111111111",
          updateTime: "2024-10-10T08:00:00.000Z",
          user: "users/111111111",
          gameJoinRestriction: {
            active: true,
            duration: "3600s",
            privateReason: "Cheating detected",
            displayReason: "Violation of terms",
            excludeAltAccounts: true,
            startTime: "2024-10-10T08:00:00.000Z",
            inherited: false,
          },
        },
        {
          path: "universes/123456789/user-restrictions/222222222",
          updateTime: "2024-10-11T09:15:00.000Z",
          user: "users/222222222",
          gameJoinRestriction: {
            active: false,
            duration: "7200s",
            privateReason: "Harassment",
            displayReason: "Community guidelines violation",
            excludeAltAccounts: false,
            startTime: "2024-10-11T09:15:00.000Z",
            inherited: true,
          },
        },
      ],
      nextPageToken: "restriction-token-123",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUserRestrictions },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.universes.listUserRestrictions("123456789");

    expect(result.userRestrictions).toHaveLength(2);
    expect(result.userRestrictions[0]?.user).toBe("users/111111111");
    expect(result.userRestrictions[0]?.gameJoinRestriction.active).toBe(true);
    expect(result.nextPageToken).toBe("restriction-token-123");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789/user-restrictions`,
    );
  });

  it("GET /universes/{id}/user-restrictions with pagination", async () => {
    const mockUserRestrictions: UserRestrictionPage = {
      userRestrictions: [
        {
          path: "universes/123456789/user-restrictions/333333333",
          updateTime: "2024-10-12T10:30:00.000Z",
          user: "users/333333333",
          gameJoinRestriction: {
            active: true,
            duration: "1800s",
            privateReason: "Spam",
            displayReason: "Spamming",
            excludeAltAccounts: true,
            startTime: "2024-10-12T10:30:00.000Z",
            inherited: false,
          },
        },
      ],
      nextPageToken: "restriction-token-456",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUserRestrictions },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.universes.listUserRestrictions("123456789", {
      maxPageSize: 50,
      pageToken: "previous-token",
    });

    expect(result.userRestrictions).toHaveLength(1);
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/universes/123456789/user-restrictions?maxPageSize=50&pageToken=previous-token`,
    );
  });

  it("GET /universes/{id}/user-restrictions/{userRestrictionId}", async () => {
    const mockUserRestriction: UserRestriction = {
      path: "universes/123456789/user-restrictions/111111111",
      updateTime: "2024-10-10T08:00:00.000Z",
      user: "users/111111111",
      gameJoinRestriction: {
        active: true,
        duration: "3600s",
        privateReason: "Cheating detected",
        displayReason: "Violation of terms",
        excludeAltAccounts: true,
        startTime: "2024-10-10T08:00:00.000Z",
        inherited: false,
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUserRestriction },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.universes.getUserRestriction(
      "123456789",
      "111111111",
    );

    expect(result.user).toBe("users/111111111");
    expect(result.gameJoinRestriction.active).toBe(true);
    expect(result.gameJoinRestriction.duration).toBe("3600s");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789/user-restrictions/111111111`,
    );
  });

  it("PATCH /universes/{id}/user-restrictions/{userRestrictionId}", async () => {
    const mockUserRestriction: UserRestriction = {
      path: "universes/123456789/user-restrictions/111111111",
      updateTime: "2024-10-22T15:00:00.000Z",
      user: "users/111111111",
      gameJoinRestriction: {
        active: true,
        duration: "7200s",
        privateReason: "Updated reason",
        displayReason: "Updated display reason",
        excludeAltAccounts: false,
        startTime: "2024-10-22T15:00:00.000Z",
        inherited: false,
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockUserRestriction },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const body: GameJoinRestriction = {
      active: true,
      duration: "7200s",
      privateReason: "Updated reason",
      displayReason: "Updated display reason",
      excludeAltAccounts: false,
    };

    const result = await openCloud.universes.updateUserRestriction(
      "123456789",
      "111111111",
      body,
    );

    expect(result.user).toBe("users/111111111");
    expect(result.gameJoinRestriction.active).toBe(true);
    expect(result.gameJoinRestriction.duration).toBe("7200s");

    const url = calls[0]?.url.toString();
    expect(url).toContain(
      `${baseUrl}/cloud/v2/universes/123456789/user-restrictions/111111111`,
    );
    expect(url).toContain("updateMask=game_join_restriction");
    expect(url).toContain("idempotencyKey.key=");
    expect(url).toContain("idempotencyKey.firstSent=");
    expect(calls[0]?.init?.method).toBe("PATCH");
  });

  it("GET /universes/{id}/user-restrictions:listLogs without options", async () => {
    const mockLogs: UserRestrictionLogPage = {
      logs: [
        {
          user: "users/111111111",
          place: "places/456789",
          moderator: {
            robloxUser: "users/999999999",
          },
          createTime: "2024-10-10T08:00:00.000Z",
          startTime: "2024-10-10T08:00:00.000Z",
          active: true,
          duration: "3600s",
          privateReason: "Cheating",
          displayReason: "Terms violation",
          excludeAltAccounts: true,
          restrictionType: {
            gameJoinRestriction: {},
          },
        },
      ],
      nextPageToken: "log-token-123",
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockLogs },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result =
      await openCloud.universes.listUserRestrictionLogs("123456789");

    expect(result.logs).toHaveLength(1);
    expect(result.logs[0]?.user).toBe("users/111111111");
    expect(result.nextPageToken).toBe("log-token-123");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789/user-restrictions:listLogs`,
    );
  });

  it("GET /universes/{id}/user-restrictions:listLogs with all options", async () => {
    const mockLogs: UserRestrictionLogPage = {
      logs: [],
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockLogs },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const result = await openCloud.universes.listUserRestrictionLogs(
      "123456789",
      {
        maxPageSize: 25,
        pageToken: "token-abc",
        filter: "user == 'users/123' && place == 'places/456'",
      },
    );

    expect(result.logs).toHaveLength(0);
    const url = calls[0]?.url.toString();
    expect(url).toBe(
      `${baseUrl}/cloud/v2/universes/123456789/user-restrictions:listLogs?maxPageSize=25&pageToken=token-abc&filter=user+%3D%3D+%27users%2F123%27+%26%26+place+%3D%3D+%27places%2F456%27`,
    );
  });

  it("POST /universes/{id}:generateSpeechAsset", async () => {
    const mockOperation: SpeechAssetOperation = {
      path: "operations/speech-123",
      done: true,
    };

    const mockResponse: SpeechAssetResponse = {
      path: "operations/speech-123",
      done: true,
      operationId: "speech-123",
      response: {
        path: "assets/12345",
        revisionId: "1",
        revisionCreateTime: "2024-10-22T15:00:00.000Z",
        assetId: "12345",
        displayName: "Generated Speech",
        description: "AI generated speech",
        assetType: "Audio",
        creationContext: {
          creator: {
            userId: "123456789",
          },
        },
        moderationResult: {
          moderationState: "Approved",
        },
        state: "Active",
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockOperation },
      { status: 200, body: mockResponse },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const body: SpeechAssetBody = {
      text: "Hello, world!",
      speechStyle: {
        voiceId: "en_us_001",
        pitch: 1.0,
        speed: 1.0,
      },
    };

    const result = await openCloud.universes.generateSpeechAsset(
      "123456789",
      body,
    );

    expect(result.operationId).toBe("speech-123");
    expect(result.response.assetId).toBe("12345");
    expect(result.response.moderationResult.moderationState).toBe("Approved");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789:generateSpeechAsset`,
    );
    expect(calls[0]?.init?.method).toBe("POST");
    expect(calls[1]?.url.toString()).toBe(
      `${baseUrl}/assets/v1/operations/speech-123`,
    );
  });

  it("POST /universes/{id}:publishMessage", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: undefined },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const body: PublishMessageBody = {
      topic: "game-updates",
      message: "Server maintenance at 3 PM",
    };

    await openCloud.universes.publishMessage("123456789", body);

    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789:publishMessage`,
    );
    expect(calls[0]?.init?.method).toBe("POST");
    expect(calls[0]?.init?.body).toContain("game-updates");
    expect(calls[0]?.init?.body).toContain("Server maintenance at 3 PM");
  });

  it("POST /universes/{id}:restartServers", async () => {
    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: undefined },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    await openCloud.universes.restartUniverseServers("123456789");

    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789:restartServers`,
    );
    expect(calls[0]?.init?.method).toBe("POST");
    expect(calls[0]?.init?.body).toBe("{}");
  });

  it("POST /universes/{id}:translateText", async () => {
    const mockResponse: TranslateTextResponse = {
      sourceLanguageCode: "en-us",
      translations: {
        "es-es": "Hola mundo",
      },
    };

    const { fetchMock, calls } = makeFetchMock([
      { status: 200, body: mockResponse },
    ]);
    const openCloud = new OpenCloud({
      apiKey: "test-api-key",
      baseUrl,
      fetchImpl: fetchMock,
    });

    const body: TranslateTextBody = {
      text: "Hello world",
      sourceLanguageCode: "",
      targetLanguageCodes: [""],
    };

    const result = await openCloud.universes.translateText("123456789", body);

    expect(result.sourceLanguageCode).toBe("en");
    expect(result.translations[""]).toBe("Hola mundo");
    expect(calls[0]?.url.toString()).toBe(
      `${baseUrl}/cloud/v2/universes/123456789:translateText`,
    );
    expect(calls[0]?.init?.method).toBe("POST");
    expect(calls[0]?.init?.body).toContain("Hello world");
  });
});
