# API Endpoint Reference

## Backend Endpoints (QR_MARKET)

All authenticated endpoints require: `Authorization: Bearer <token>` header

### Public Endpoints

#### Redirect QR Code (Records Analytics)
```
GET /qrcode/:slug/scan
Response: 301 Redirect to destinationUrl
```
- No authentication required
- Records scan analytics
- Redirects to destination URL
- Used by public QR scans

---

### Authenticated Endpoints

#### Create QR Code
```
POST /qrcode
Authentication: Required
Body: {
  type: "CUSTOM_URL" | "GOOGLE_REVIEW" | "PRODUCT_LINK",
  destinationUrl: string (required, valid URL),
  expiresAt?: Date (optional)
}
Response: 201 Created
{
  _id: string,
  userId: string,
  slug: string,
  type: string,
  destinationUrl: string,
  isActive: boolean,
  expiresAt: Date | null,
  scanCount: number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Get All User's QR Codes
```
GET /qrcode
Authentication: Required
Response: 200 OK
[
  { ...QRCodeData },
  { ...QRCodeData }
]
```

#### Get Single QR Code
```
GET /qrcode/:id
Authentication: Required
Response: 200 OK
{ ...QRCodeData }
```

#### Update QR Code
```
PUT /qrcode/:id
Authentication: Required
Body: {
  destinationUrl?: string,
  isActive?: boolean,
  expiresAt?: Date
}
Response: 200 OK
{ ...UpdatedQRCodeData }
```

#### Rotate Link (Change Destination URL)
```
POST /qrcode/:id/rotate-link
Authentication: Required
Body: {
  destinationUrl: string (required, valid URL)
}
Response: 200 OK
{ ...UpdatedQRCodeData }
```

#### Disable QR Code
```
POST /qrcode/:id/disable
Authentication: Required
Body: {}
Response: 200 OK
{ ...UpdatedQRCodeData with isActive: false }
```

#### Delete QR Code
```
DELETE /qrcode/:id
Authentication: Required
Response: 200 OK
{ message: "QR Code deleted successfully" }
```

---

## Frontend Service Layer (QR_MARKET_FE)

Located in `src/services/qrcode.service.ts`

### Service Methods

#### createQRCodeService
```typescript
createQRCodeService(data: CreateQRCodeData): Promise<QRCodeResponseData>
```
- Makes POST request to `/qrcode`
- Validates URL format
- Returns created QR code

#### getUserQRCodesService
```typescript
getUserQRCodesService(): Promise<QRCodeResponseData[]>
```
- Makes GET request to `/qrcode`
- Returns array of all user's QR codes

#### getQRCodeService
```typescript
getQRCodeService(qrCodeId: string): Promise<QRCodeResponseData>
```
- Makes GET request to `/qrcode/:id`
- Returns single QR code details

#### updateQRCodeService
```typescript
updateQRCodeService(
  qrCodeId: string, 
  data: UpdateQRCodeData
): Promise<QRCodeResponseData>
```
- Makes PUT request to `/qrcode/:id`
- Updates QR code details

#### rotateLinkService
```typescript
rotateLinkService(
  qrCodeId: string, 
  data: RotateLinkData
): Promise<QRCodeResponseData>
```
- Makes POST request to `/qrcode/:id/rotate-link`
- Changes destination URL

#### disableQRCodeService
```typescript
disableQRCodeService(qrCodeId: string): Promise<QRCodeResponseData>
```
- Makes POST request to `/qrcode/:id/disable`
- Disables QR code

#### deleteQRCodeService
```typescript
deleteQRCodeService(qrCodeId: string): Promise<{ message: string }>
```
- Makes DELETE request to `/qrcode/:id`
- Permanently deletes QR code

---

## Hook Methods (useQRCode)

Located in `src/hooks/useQRCode.ts`

### Hook Interface
```typescript
{
  qrCodes: QRCodeResponseData[];
  isLoading: boolean;
  error: string | null;
  fetchQRCodes: () => Promise<void>;
  createQRCode: (data: CreateQRCodeData) => Promise<QRCodeResponseData>;
  getQRCode: (id: string) => Promise<QRCodeResponseData>;
  updateQRCode: (id: string, data: UpdateQRCodeData) => Promise<QRCodeResponseData>;
  rotateLink: (id: string, data: RotateLinkData) => Promise<QRCodeResponseData>;
  disableQRCode: (id: string) => Promise<QRCodeResponseData>;
  deleteQRCode: (id: string) => Promise<void>;
  clearError: () => void;
}
```

### Key Features
- Auto-updates list on mutations
- Handles loading and error states
- Type-safe all operations
- Error messages propagated to UI
- Hooks follow React best practices

---

## Type Definitions

### QRCodeType Enum
```typescript
export enum QRCodeType {
  GOOGLE_REVIEW = "GOOGLE_REVIEW",
  CUSTOM_URL = "CUSTOM_URL",
  PRODUCT_LINK = "PRODUCT_LINK",
}
```

### CreateQRCodeData
```typescript
interface CreateQRCodeData {
  type: QRCodeType;
  destinationUrl: string;
  expiresAt?: Date | string;
}
```

### UpdateQRCodeData
```typescript
interface UpdateQRCodeData {
  destinationUrl?: string;
  isActive?: boolean;
  expiresAt?: Date | string;
}
```

### RotateLinkData
```typescript
interface RotateLinkData {
  destinationUrl: string;
}
```

### QRCodeResponseData
```typescript
interface QRCodeResponseData {
  _id: string;
  userId: string;
  slug: string;
  type: QRCodeType;
  destinationUrl: string;
  isActive: boolean;
  expiresAt: Date | null;
  qrCodeImageUrl?: string;
  scanCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Responses

All endpoints follow this error format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Error Cases

#### 400 Bad Request
- Invalid request body
- URL validation failed
- Expiry date in past

#### 401 Unauthorized
- Missing authentication token
- Invalid token
- Token expired

#### 404 Not Found
- QR code doesn't exist
- User doesn't own QR code
- Invalid slug for public redirect

#### 500 Internal Server Error
- Database error
- Server error

---

## Request/Response Examples

### Example 1: Create QR Code

**Request:**
```bash
POST http://localhost:3002/qrcode
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "type": "CUSTOM_URL",
  "destinationUrl": "https://www.google.com/search?q=coffee",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f2e1c3b4f1a9d8c7e6f5a4",
    "userId": "65f2ddc3b4f1a9d8c7e6f5a0",
    "slug": "cF9pK2xL4m",
    "type": "CUSTOM_URL",
    "destinationUrl": "https://www.google.com/search?q=coffee",
    "isActive": true,
    "expiresAt": "2024-12-31T23:59:59Z",
    "scanCount": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "QR Code created successfully"
}
```

### Example 2: List QR Codes

**Request:**
```bash
GET http://localhost:3002/qrcode
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    { ...QRCodeData1 },
    { ...QRCodeData2 },
    { ...QRCodeData3 }
  ],
  "message": "QR Codes retrieved successfully"
}
```

### Example 3: Rotate Link

**Request:**
```bash
POST http://localhost:3002/qrcode/65f2e1c3b4f1a9d8c7e6f5a4/rotate-link
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "destinationUrl": "https://www.example.com/new-campaign"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f2e1c3b4f1a9d8c7e6f5a4",
    "userId": "65f2ddc3b4f1a9d8c7e6f5a0",
    "slug": "cF9pK2xL4m",
    "type": "CUSTOM_URL",
    "destinationUrl": "https://www.example.com/new-campaign",
    "isActive": true,
    "expiresAt": "2024-12-31T23:59:59Z",
    "scanCount": 5,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  },
  "message": "QR Code link rotated successfully"
}
```

### Example 4: Public Redirect

**Request:**
```bash
GET http://localhost:3002/qrcode/cF9pK2xL4m/scan
```

**Response (301):**
```
Location: https://www.example.com/new-campaign
```

---

## Integration Checklist

- [ ] Backend has all QRCode endpoints implemented
- [ ] Authentication middleware works correctly
- [ ] Analytics service records scan data
- [ ] Database indexes are set up for slug and userId
- [ ] Error handling returns proper status codes
- [ ] Environment variables are configured
- [ ] CORS is configured if needed
- [ ] Rate limiting is considered
- [ ] Public redirect endpoint doesn't require auth

---

## Performance Considerations

1. **List QR Codes**: Use pagination for users with many QR codes
2. **Public Redirect**: Cache slug->destinationUrl mapping
3. **Analytics**: Write analytics async to avoid blocking redirects
4. **Indexes**: Ensure slug and userId are indexed in database
5. **Rate Limiting**: Limit scan endpoint to prevent abuse

---

## Security Considerations

1. **URL Validation**: Both frontend and backend validate URLs
2. **Authorization**: All endpoints check user ownership except public redirect
3. **Expiry**: Respect expiry dates before allowing redirect
4. **Active Status**: Check isActive before allowing redirect
5. **Rate Limiting**: Prevent brute force on scan endpoint
6. **CORS**: Only allow trusted origins
