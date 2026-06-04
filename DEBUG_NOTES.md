# Debug Notes

## Bug 1: Duplicate or Messy Hobby Entries

### Symptom

Adding hobbies such as `Coding`, ` coding `, or comma-separated input could create inconsistent user hobby data or duplicate-looking hobby suggestions.

### Root Cause

The hobby workflow accepts free-form text. Without normalization, case-insensitive comparison, and splitting comma-separated input, the same hobby could be treated as multiple values. The global hobby collection also needed duplicate protection when casing differed.

### Fix Details

- Added trimming through `normalizeHobby`.
- Added comma splitting through `getHobbyParts`.
- Compared existing user hobbies case-insensitively before pushing a new value.
- Used an escaped, case-insensitive exact-match regular expression with `findOneAndUpdate(..., { upsert: true })` so the global `Hobby` collection stores one logical hobby.
- Deduplicated `getAllHobbies` results case-insensitively before returning them to the frontend.

Affected file: `Backend/src/services/hobby.service.js`

## Bug 2: Popularity Score Could Become Stale After Friendship Changes

### Symptom

After users were linked or unlinked, popularity-based recommendations and profile data could show an outdated score.

### Root Cause

Popularity is stored on the `User` document, but the value depends on friendship count and shared hobbies with friends. If the score is not recalculated immediately after relationship changes, persisted popularity no longer represents the current graph.

### Fix Details

- Recalculated popularity for both users after `linkUsers`.
- Recalculated popularity for both users after `unlinkUsers`.
- Added tests around popularity behavior, including the score dropping to `0` after a user has no friends.

Affected files:

- `Backend/src/services/friendship.service.js`
- `Backend/src/services/popularity.service.js`
- `Backend/src/helpers/calculatePopularity.js`
- `Backend/tests/popularity.test.js`

