# Groups Resource

The Groups resource provides methods to interact with Roblox group data, including group information, members, roles, join requests, and shouts.

## Getting Group Information

Retrieve basic group information by group ID:

```typescript
const group = await client.groups.get("123456789");

console.log(group.displayName);     // "My Awesome Group"
console.log(group.description);
console.log(group.owner);           // "users/987654321"
console.log(group.memberCount);
console.log(group.publicEntryAllowed);
```

## Working with Members

List all members in a group with pagination support:

```typescript
const members = await client.groups.listGroupMemberships("123456789", {
  maxPageSize: 100
});

for (const member of members.groupMemberships) {
  console.log(member.user);  // "users/987654321"
  console.log(member.role);  // "groups/123456789/roles/12345"
}
```

### Filtering by Role

Retrieve only members with a specific role:

```typescript
const admins = await client.groups.listGroupMemberships("123456789", {
  filter: "role == 'groups/123456789/roles/12345'"
});

console.log(`Admin count: ${admins.groupMemberships.length}`);
```

### Updating Member Roles

Change a member's role in the group:

```typescript
const updated = await client.groups.updateGroupMembership(
  "123456789",     // Group ID
  "987654321",     // Membership ID (user ID)
  "12345"          // New role ID
);

console.log(`Updated role: ${updated.role}`);
```

## Managing Group Roles

### Listing All Roles

Get all roles in a group:

```typescript
const roles = await client.groups.listGroupRoles("123456789");

for (const role of roles.groupRoles) {
  console.log(role.displayName);     // "Admin", "Member", etc.
  console.log(role.rank);            // Role rank (0-255)
  console.log(role.memberCount);
}
```

### Getting a Specific Role

Retrieve detailed information about a single role:

```typescript
const role = await client.groups.getGroupRole("123456789", "12345");

console.log(role.displayName);
console.log(role.description);
console.log(role.permissions);     // Role permissions object
```

## Handling Join Requests

For invite-only groups, manage join requests:

### Listing Join Requests

```typescript
const requests = await client.groups.listGroupJoinRequests("123456789", {
  maxPageSize: 50
});

for (const request of requests.groupJoinRequests) {
  console.log(request.user);      // "users/987654321"
  console.log(request.createTime);
}
```

### Filtering Requests

Find join requests from a specific user:

```typescript
const userRequest = await client.groups.listGroupJoinRequests("123456789", {
  filter: "user == 'users/987654321'"
});
```

### Accepting Requests

```typescript
await client.groups.acceptGroupJoinRequest(
  "123456789",     // Group ID
  "555555555"      // Join request ID
);

console.log("Join request accepted");
```

### Declining Requests

```typescript
await client.groups.declineGroupJoinRequest(
  "123456789",     // Group ID
  "555555555"      // Join request ID
);

console.log("Join request declined");
```

## Working with Group Shouts

Retrieve the current group shout (announcement):

```typescript
const shout = await client.groups.getGroupShout("123456789");

if (shout.content) {
  console.log(shout.content);        // Shout message
  console.log(shout.poster);         // User who posted
  console.log(shout.createTime);
  console.log(shout.updateTime);
} else {
  console.log("No active shout");
}
```

## Complete Example

Here's a complete example that combines multiple group operations:

```typescript
// Get group information
const group = await client.groups.get("123456789");
console.log(`Managing group: ${group.displayName}`);

// List all roles
const roles = await client.groups.listGroupRoles("123456789");
console.log(`Total roles: ${roles.groupRoles.length}`);

// Get admin role
const adminRole = roles.groupRoles.find(r => r.displayName === "Admin");

// List members with admin role
if (adminRole) {
  const admins = await client.groups.listGroupMemberships("123456789", {
    filter: `role == '${adminRole.id}'`
  });
  console.log(`Total admins: ${admins.groupMemberships.length}`);
}

// Check for pending join requests
const requests = await client.groups.listGroupJoinRequests("123456789");
console.log(`Pending requests: ${requests.groupJoinRequests.length}`);
```
