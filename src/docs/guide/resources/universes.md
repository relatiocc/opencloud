# Universes Resource

The Universes resource provides methods to interact with Roblox universe (game) data, including settings, user restrictions, messaging, translation, and speech generation.

## Getting Universe Information

Retrieve universe information by universe ID:

```typescript
const universe = await client.universes.get("123456789");

console.log(universe.displayName);
console.log(universe.voiceChatEnabled);
console.log(universe.desktopEnabled);
console.log(universe.privateServerPriceRobux);
```

## Updating Universe Settings

Update platform availability and other settings:

```typescript
await client.universes.update("123456789", {
  voiceChatEnabled: true,
  desktopEnabled: true,
  mobileEnabled: true,
  privateServerPriceRobux: 100
});
```

## Managing User Restrictions

### Listing User Restrictions

Get all banned users in your universe:

```typescript
const restrictions = await client.universes.listUserRestrictions("123456789");

for (const restriction of restrictions.userRestrictions) {
  console.log(restriction.user);
  console.log(restriction.gameJoinRestriction.active);
  console.log(restriction.gameJoinRestriction.displayReason);
}
```

### Getting a User Restriction

Check restriction details for a specific user:

```typescript
const restriction = await client.universes.getUserRestriction(
  "123456789",  // Universe ID
  "987654321"   // User ID
);

console.log(restriction.gameJoinRestriction.duration);
console.log(restriction.gameJoinRestriction.displayReason);
```

### Banning a User

Apply a temporary or permanent ban:

```typescript
await client.universes.updateUserRestriction(
  "123456789",
  "987654321",
  {
    active: true,
    duration: "86400s",  // 24 hours in seconds
    privateReason: "Cheating detected",
    displayReason: "Violation of game rules",
    excludeAltAccounts: true
  }
);
```

### Unbanning a User

Remove a user restriction:

```typescript
await client.universes.updateUserRestriction(
  "123456789",
  "987654321",
  {
    active: false,
    duration: "0s",
    privateReason: "Ban appeal approved",
    displayReason: "Restriction lifted",
    excludeAltAccounts: false
  }
);
```

### Viewing Restriction Logs

Track all restriction changes:

```typescript
const logs = await client.universes.listUserRestrictionLogs("123456789");

for (const log of logs.logs) {
  console.log(`User: ${log.user}`);
  console.log(`Moderator: ${log.moderator.robloxUser}`);
  console.log(`Reason: ${log.displayReason}`);
}
```

Filter logs by user or place:

```typescript
const userLogs = await client.universes.listUserRestrictionLogs("123456789", {
  filter: "user == 'users/987654321'"
});
```

## Publishing Messages

Send messages to subscribed game servers:

```typescript
await client.universes.publishMessage("123456789", {
  topic: "server-announcements",
  message: JSON.stringify({
    type: "maintenance",
    scheduledTime: "2024-11-15T03:00:00Z"
  })
});
```

::: tip
Use MessagingService in your game to subscribe to topics and receive these messages.
:::

## Translating Text

Translate strings into multiple languages:

```typescript
const translation = await client.universes.translateText("123456789", {
  text: "Welcome to the game!",
  sourceLanguageCode: "en-us",
  targetLanguageCodes: ["es-es", "fr-fr"]
});

console.log(translation.translations["es-es"]);
console.log(translation.translations["fr-fr"]);
```

## Generating Speech Assets

Create AI-generated speech from text:

```typescript
const speechAsset = await client.universes.generateSpeechAsset("123456789", {
  text: "Welcome to the game!",
  speechStyle: {
    voiceId: "en_us_001",
    pitch: 1.0,
    speed: 1.0
  }
});

if (speechAsset.response.moderationResult.moderationState === "Approved") {
  console.log(`Asset ID: ${speechAsset.response.assetId}`);
}
```

Customize voice characteristics:

```typescript
const deepVoice = await client.universes.generateSpeechAsset("123456789", {
  text: "This is a deep voice",
  speechStyle: {
    voiceId: "en_us_001",
    pitch: 0.7,   // Lower pitch
    speed: 0.8    // Slower speed
  }
});
```

::: warning
Generated speech assets require moderation approval before use. Check the `moderationState` field.
:::
