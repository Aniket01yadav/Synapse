# API Documentation

## GET

### GET http://localhost:5000/

Response:

```json
{
  "success": true,
  "message": "Synapse API Running"
}
```

### GET http://localhost:5000/api/auth/me

Response:

```json
{
  "_id": "665f1b8433853fe5f417ba10",
  "username": "anika",
  "email": "anika@example.com",
  "age": 24,
  "hobbies": ["Coding", "Cricket"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2026-06-05T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z"
}
```

### GET http://localhost:5000/api/users

Response:

```json
[
  {
    "_id": "665f1b8433853fe5f417ba10",
    "username": "anika",
    "email": "anika@example.com",
    "age": 24,
    "hobbies": ["Coding", "Cricket"],
    "friends": [
      {
        "_id": "665f1c0e33853fe5f417ba14",
        "username": "ravi",
        "age": 25
      }
    ],
    "popularityScore": 3,
    "createdAt": "2026-06-05T00:00:00.000Z",
    "updatedAt": "2026-06-05T00:00:00.000Z"
  }
]
```

### GET http://localhost:5000/api/users/:id

Response:

```json
{
  "_id": "665f1b8433853fe5f417ba10",
  "username": "anika",
  "email": "anika@example.com",
  "age": 24,
  "hobbies": ["Coding", "Cricket"],
  "friends": [
    {
      "_id": "665f1c0e33853fe5f417ba14",
      "username": "ravi",
      "age": 25,
      "hobbies": ["Coding", "Music"]
    }
  ],
  "popularityScore": 3,
  "createdAt": "2026-06-05T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z"
}
```

### GET http://localhost:5000/api/hobbies

Response:

```json
[
  {
    "_id": "665f1d3033853fe5f417ba20",
    "name": "Coding"
  },
  {
    "_id": "665f1d3033853fe5f417ba21",
    "name": "Cricket"
  }
]
```

### GET http://localhost:5000/api/graph

Response:

```json
{
  "nodes": [
    {
      "id": "665f1b8433853fe5f417ba10",
      "type": "userNode",
      "data": {
        "username": "anika",
        "age": 24,
        "hobbies": ["Coding", "Cricket"],
        "friendCount": 1,
        "popularityScore": 3
      },
      "position": {
        "x": 0,
        "y": 0
      }
    }
  ],
  "edges": [
    {
      "id": "665f1b8433853fe5f417ba10-665f1c0e33853fe5f417ba14",
      "source": "665f1b8433853fe5f417ba10",
      "target": "665f1c0e33853fe5f417ba14",
      "animated": true
    }
  ]
}
```

### GET http://localhost:5000/api/recommendations/:id

Response:

```json
{
  "friends": [
    {
      "userId": "665f1c0e33853fe5f417ba14",
      "username": "ravi",
      "age": 25,
      "score": 8,
      "reason": "1 mutual friends, 1 shared hobbies",
      "sourceSignals": ["mutualFriends", "sharedHobbies", "popularity"]
    }
  ],
  "hobbies": [
    {
      "hobby": "Music",
      "score": 4.5,
      "reason": "1 friends enjoy this",
      "sourceSignals": ["friendsWithHobby", "hobbyPopularity"]
    }
  ]
}
```

## POST

### POST http://localhost:5000/api/auth/register

Response:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "_id": "665f1b8433853fe5f417ba10",
    "username": "anika",
    "email": "anika@example.com",
    "age": 24,
    "hobbies": [],
    "friends": [],
    "popularityScore": 0,
    "createdAt": "2026-06-05T00:00:00.000Z",
    "updatedAt": "2026-06-05T00:00:00.000Z"
  }
}
```

### POST http://localhost:5000/api/auth/login

Response:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "_id": "665f1b8433853fe5f417ba10",
    "username": "anika",
    "email": "anika@example.com",
    "age": 24,
    "hobbies": ["Coding"],
    "friends": [],
    "popularityScore": 0,
    "createdAt": "2026-06-05T00:00:00.000Z",
    "updatedAt": "2026-06-05T00:00:00.000Z"
  }
}
```

### POST http://localhost:5000/api/users

Response:

```json
{
  "_id": "665f1b8433853fe5f417ba10",
  "username": "anika",
  "email": "anika@example.com",
  "password": "hashed-password",
  "age": 24,
  "hobbies": ["Coding"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2026-06-05T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z"
}
```

### POST http://localhost:5000/api/users/:id/link

Response:

```json
{
  "success": true,
  "message": "Users linked successfully"
}
```

### POST http://localhost:5000/api/hobbies/:id

Response:

```json
{
  "_id": "665f1b8433853fe5f417ba10",
  "username": "anika",
  "email": "anika@example.com",
  "age": 24,
  "hobbies": ["Coding", "Cricket"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2026-06-05T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z"
}
```

### POST http://localhost:5000/api/recommendations/:id/feedback

Response:

```json
{
  "success": true,
  "feedback": {
    "_id": "665f1e4a33853fe5f417ba30",
    "userId": "665f1b8433853fe5f417ba10",
    "recommendationId": "665f1c0e33853fe5f417ba14",
    "type": "friend",
    "action": "accepted",
    "createdAt": "2026-06-05T00:00:00.000Z",
    "updatedAt": "2026-06-05T00:00:00.000Z"
  }
}
```

## PUT

### PUT http://localhost:5000/api/users/:id

Response:

```json
{
  "_id": "665f1b8433853fe5f417ba10",
  "username": "anika updated",
  "email": "anika@example.com",
  "age": 25,
  "hobbies": ["Coding", "Music"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2026-06-05T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z"
}
```

## DELETE

### DELETE http://localhost:5000/api/users/:id

Response:

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### DELETE http://localhost:5000/api/users/:id/unlink

Response:

```json
{
  "success": true,
  "message": "Users unlinked successfully"
}
```

### DELETE http://localhost:5000/api/hobbies/:id

Response:

```json
{
  "_id": "665f1b8433853fe5f417ba10",
  "username": "anika",
  "email": "anika@example.com",
  "age": 24,
  "hobbies": ["Coding"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2026-06-05T00:00:00.000Z",
  "updatedAt": "2026-06-05T00:00:00.000Z"
}
```

