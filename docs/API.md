# API Documentation

This document describes the REST API endpoints for the Gundam Card Game website.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication. Include the session cookie or JWT token in requests.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Endpoints

### Health Check

#### GET /api/health
Check the health status of the application.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Cards

#### GET /api/cards
Get a list of cards with pagination and filtering.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search query
- `type` (string, optional): Filter by card type
- `rarity` (string, optional): Filter by rarity
- `set` (string, optional): Filter by set

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "card-001",
      "name": "RX-78-2 Gundam",
      "level": 3,
      "cost": 2,
      "type": "Mobile Suit",
      "rarity": "Rare",
      "set": "Awakening of the New Era",
      "setNumber": "ST01-001",
      "imageUrl": "/images/cards/ST01-001.jpg",
      "description": "The legendary RX-78-2 Gundam"
    }
  ],
  "pagination": { ... }
}
```

#### GET /api/cards/[id]
Get a specific card by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "card-001",
    "name": "RX-78-2 Gundam",
    "level": 3,
    "cost": 2,
    "type": "Mobile Suit",
    "rarity": "Rare",
    "set": "Awakening of the New Era",
    "setNumber": "ST01-001",
    "imageUrl": "/images/cards/ST01-001.jpg",
    "imageUrlSmall": "/images/cards/ST01-001_small.jpg",
    "imageUrlLarge": "/images/cards/ST01-001_large.jpg",
    "description": "The legendary RX-78-2 Gundam",
    "rulings": "Official rulings text",
    "officialText": "When this unit is deployed, draw 1 card.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/cards
Create a new card (Admin only).

**Request Body:**
```json
{
  "name": "New Card",
  "level": 2,
  "cost": 1,
  "typeId": "type-mobile-suit",
  "rarityId": "rarity-common",
  "setId": "set-01",
  "setNumber": "ST01-999",
  "description": "Card description",
  "officialText": "Card effect text"
}
```

#### PUT /api/cards/[id]
Update a card (Admin only).

**Request Body:** Same as POST

#### DELETE /api/cards/[id]
Delete a card (Admin only).

### Decks

#### GET /api/decks
Get a list of decks with pagination and filtering.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `search` (string, optional): Search query
- `public` (boolean, optional): Filter public decks
- `userId` (string, optional): Filter by user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "deck-001",
      "name": "Gundam Deck",
      "description": "A powerful Gundam deck",
      "isPublic": true,
      "userId": "user-001",
      "cards": [
        {
          "cardId": "card-001",
          "quantity": 2
        }
      ],
      "statistics": {
        "totalCards": 50,
        "uniqueCards": 25,
        "averageCost": 2.5
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /api/decks/[id]
Get a specific deck by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deck-001",
    "name": "Gundam Deck",
    "description": "A powerful Gundam deck",
    "isPublic": true,
    "userId": "user-001",
    "cards": [
      {
        "card": {
          "id": "card-001",
          "name": "RX-78-2 Gundam",
          "imageUrl": "/images/cards/ST01-001.jpg"
        },
        "quantity": 2
      }
    ],
    "statistics": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/decks
Create a new deck.

**Request Body:**
```json
{
  "name": "My New Deck",
  "description": "Deck description",
  "isPublic": false,
  "cards": [
    {
      "cardId": "card-001",
      "quantity": 2
    }
  ]
}
```

#### PUT /api/decks/[id]
Update a deck.

**Request Body:** Same as POST

#### DELETE /api/decks/[id]
Delete a deck.

### Collections

#### GET /api/collections
Get user's collection.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "collection-001",
    "userId": "user-001",
    "cards": [
      {
        "card": {
          "id": "card-001",
          "name": "RX-78-2 Gundam",
          "imageUrl": "/images/cards/ST01-001.jpg"
        },
        "quantity": 3
      }
    ],
    "statistics": {
      "totalCards": 150,
      "uniqueCards": 75,
      "completionPercentage": 45.5
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/collections
Add cards to collection.

**Request Body:**
```json
{
  "cards": [
    {
      "cardId": "card-001",
      "quantity": 2
    }
  ]
}
```

#### GET /api/collections/[cardId]
Get collection entry for a specific card.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "collection-card-001",
    "collectionId": "collection-001",
    "cardId": "card-001",
    "quantity": 3,
    "card": {
      "id": "card-001",
      "name": "RX-78-2 Gundam",
      "imageUrl": "/images/cards/ST01-001.jpg"
    }
  }
}
```

#### PUT /api/collections/[cardId]
Update quantity of a card in collection.

**Request Body:**
```json
{
  "quantity": 5
}
```

#### DELETE /api/collections/[cardId]
Remove card from collection.

### Authentication

#### POST /api/auth/login
User login.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-001",
      "email": "user@example.com",
      "name": "User Name"
    },
    "token": "jwt-token"
  }
}
```

#### POST /api/auth/register
User registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:** Same as login

#### POST /api/auth/logout
User logout.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /api/auth/me
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/auth/me
Update current user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

### File Upload

#### POST /api/upload/card-image
Upload card image.

**Request:** Multipart form data with `image` field

**Response:**
```json
{
  "success": true,
  "data": {
    "original": "/uploads/cards/original/card-123.jpg",
    "thumbnail": "/uploads/cards/thumbnails/card-123-thumb.jpg",
    "large": "/uploads/cards/large/card-123-large.jpg",
    "metadata": {
      "width": 800,
      "height": 600,
      "format": "jpeg",
      "size": 125000
    }
  }
}
```

## Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Common Error Types
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication required
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- **Default**: 100 requests per 15 minutes
- **Authentication**: 10 requests per minute
- **File Upload**: 5 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:
- `page` - Page number (1-based)
- `limit` - Items per page (max 100)

Pagination information is included in the response:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

### Cards
- `search` - Search in name and description
- `type` - Filter by card type
- `rarity` - Filter by rarity
- `set` - Filter by set
- `sort` - Sort by field (name, level, cost, createdAt)
- `order` - Sort order (asc, desc)

### Decks
- `search` - Search in name and description
- `public` - Filter public/private decks
- `userId` - Filter by user
- `sort` - Sort by field (name, createdAt, updatedAt)
- `order` - Sort order (asc, desc)

## Webhooks

Webhook endpoints for real-time updates (future implementation):
- `POST /api/webhooks/deck-updated` - Deck modification events
- `POST /api/webhooks/collection-updated` - Collection modification events

## SDK and Client Libraries

### JavaScript/TypeScript
```typescript
import { GundamCardGameAPI } from '@gundam-card-game/api-client';

const api = new GundamCardGameAPI({
  baseURL: 'https://api.gundam-card-game.com',
  apiKey: 'your-api-key'
});

// Get cards
const cards = await api.cards.list({
  page: 1,
  limit: 20,
  search: 'gundam'
});

// Create deck
const deck = await api.decks.create({
  name: 'My Deck',
  description: 'A powerful deck',
  cards: [
    { cardId: 'card-001', quantity: 2 }
  ]
});
```

## Testing

### API Testing
Use the provided test utilities:

```typescript
import { testAPI } from '@/lib/test-utils';

describe('Cards API', () => {
  it('should return cards list', async () => {
    const response = await testAPI.get('/api/cards');
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});
```

### Postman Collection
A Postman collection is available for API testing:
- Import `docs/postman/Gundam-Card-Game-API.postman_collection.json`
- Set environment variables for different environments
- Use the collection for manual testing and documentation

## Changelog

### Version 1.0.0
- Initial API implementation
- Cards, Decks, Collections endpoints
- Authentication system
- File upload functionality
- Rate limiting and pagination
