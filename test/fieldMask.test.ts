import { describe, it, expect } from "vitest";
import { buildFieldMask } from "../src/utils/fieldMask";

describe("buildFieldMask", () => {
  it("should return empty string for empty object", () => {
    const result = buildFieldMask({});
    expect(result).toBe("");
  });

  it("should handle simple top-level fields", () => {
    const body = {
      name: "John",
      age: 30,
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,age,active");
  });

  it("should handle null values", () => {
    const body = {
      name: "John",
      description: null,
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,description,active");
  });

  it("should skip undefined fields", () => {
    const body = {
      name: "John",
      age: undefined,
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,active");
  });

  it("should handle nested objects", () => {
    const body = {
      user: {
        name: "John",
        email: "john@example.com",
      },
    };
    const result = buildFieldMask(body);
    expect(result).toBe("user.name,user.email");
  });

  it("should handle deeply nested objects", () => {
    const body = {
      user: {
        profile: {
          personal: {
            firstName: "John",
            lastName: "Doe",
          },
        },
      },
    };
    const result = buildFieldMask(body);
    expect(result).toBe(
      "user.profile.personal.firstName,user.profile.personal.lastName",
    );
  });

  it("should handle null values in nested objects", () => {
    const body = {
      user: {
        name: "John",
        profile: null,
      },
    };
    const result = buildFieldMask(body);
    expect(result).toBe("user.name,user.profile");
  });

  it("should handle arrays", () => {
    const body = {
      tags: ["tag1", "tag2"],
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("tags,active");
  });

  it("should handle empty arrays", () => {
    const body = {
      tags: [],
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("tags,active");
  });

  it("should handle arrays of objects", () => {
    const body = {
      items: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
    };
    const result = buildFieldMask(body);
    expect(result).toBe("items");
  });

  it("should handle empty nested objects", () => {
    const body = {
      user: {},
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("user,active");
  });

  it("should handle mixed nested structures", () => {
    const body = {
      name: "John",
      profile: {
        bio: "Developer",
        social: {
          twitter: "johndoe",
        },
      },
      tags: ["developer", "writer"],
      active: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,profile.bio,profile.social.twitter,tags,active");
  });

  it("should handle objects with undefined nested fields", () => {
    const body = {
      user: {
        name: "John",
        email: undefined,
        profile: {
          bio: "Developer",
        },
      },
    };
    const result = buildFieldMask(body);
    expect(result).toBe("user.name,user.profile.bio");
  });

  it("should handle complex real-world example", () => {
    const body = {
      displayName: "New Name",
      about: "Updated bio",
      socialNetworkProfiles: {
        twitter: "newhandle",
        youtube: null,
      },
      premium: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe(
      "displayName,about,socialNetworkProfiles.twitter,socialNetworkProfiles.youtube,premium",
    );
  });

  it("should handle partial updates with mixed types", () => {
    const body = {
      name: "John",
      age: 30,
      address: {
        street: "123 Main St",
        city: null,
      },
      hobbies: ["reading", "coding"],
      metadata: {},
    };
    const result = buildFieldMask(body);
    expect(result).toBe(
      "name,age,address.street,address.city,hobbies,metadata",
    );
  });

  it("should handle boolean false values", () => {
    const body = {
      name: "John",
      active: false,
      verified: true,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,active,verified");
  });

  it("should handle number zero values", () => {
    const body = {
      name: "John",
      count: 0,
      score: 100,
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,count,score");
  });

  it("should handle empty string values", () => {
    const body = {
      name: "",
      description: "Valid description",
    };
    const result = buildFieldMask(body);
    expect(result).toBe("name,description");
  });

  it("should handle deeply nested structure with nulls and undefined", () => {
    const body = {
      level1: {
        level2: {
          field1: "value",
          field2: null,
          field3: undefined,
          level3: {
            field4: "deep value",
          },
        },
      },
    };
    const result = buildFieldMask(body);
    expect(result).toBe(
      "level1.level2.field1,level1.level2.field2,level1.level2.level3.field4",
    );
  });
});
