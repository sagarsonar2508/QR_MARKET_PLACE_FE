# QR Code Management System

This document describes the QR code management feature implementation in QR_MARKET_FE.

## Features

### 1. Create QR Codes
- Create multiple QR code types:
  - **Custom URL**: Point to any custom URL
  - **Google Review**: Direct users to leave Google reviews
  - **Product Link**: Link to product pages
- Set optional expiry dates
- Real-time validation of URLs

### 2. View QR Codes
- Dashboard list view with all user's QR codes
- Grid layout with key information displayed on each card
- Status indicators (Active, Inactive, Expired)
- Scan count display
- Quick action buttons

### 3. Rotate Links
- Change destination URL without regenerating QR code pattern
- Useful for A/B testing and campaigns
- Modal dialog for easy management

### 4. Disable/Enable QR Codes
- Temporarily disable QR codes without deleting them
- Prevent further scans on disabled codes
- Easy re-enable option

### 5. Delete QR Codes
- Permanently delete QR codes
- Confirmation dialog to prevent accidental deletion
- Cannot be undone

### 6. Analytics
- Track scan count per QR code
- View creation date and status
- Monitor expiry status
- Real-time updates

### 7. Public QR Code Redirect
- Publicly accessible QR code redirect page
- Automatic analytics recording
- No authentication required for scanning

## Project Structure

```
src/
├── services/
│   └── qrcode.service.ts          # API service for QR code operations
├── hooks/
│   └── useQRCode.ts               # Custom hook for QR code state management
├── components/
│   ├── QRCodeCard.tsx             # Individual QR code card component
│   └── modals/
│       ├── CreateQRCodeModal.tsx  # Modal for creating QR codes
│       ├── RotateLinkModal.tsx    # Modal for rotating links
│       ├── ConfirmDialog.tsx      # Confirmation dialog component
│       └── index.ts               # Modal exports
├── app/
│   ├── dashboard/
│   │   └── qrcodes/
│   │       ├── page.tsx           # QR codes list page
│   │       └── [id]/
│   │           └── page.tsx       # QR code detail page
│   └── qr/
│       └── [slug]/
│           └── page.tsx           # Public QR redirect page
```

## API Endpoints

All endpoints require authentication except for `/qr/[slug]`

### QR Code Management
- `POST /qrcode` - Create new QR code
- `GET /qrcode` - Get all user's QR codes
- `GET /qrcode/:id` - Get single QR code
- `PUT /qrcode/:id` - Update QR code
- `POST /qrcode/:id/rotate-link` - Change destination URL
- `POST /qrcode/:id/disable` - Disable QR code
- `DELETE /qrcode/:id` - Delete QR code

### Public Endpoints
- `GET /qr/:slug` - Redirect to destination URL (records scan)

## Usage

### Creating a QR Code
```typescript
import { useQRCode } from "@/hooks/useQRCode";
import { QRCodeType } from "@/services/qrcode.service";

const { createQRCode } = useQRCode();

await createQRCode({
  type: QRCodeType.CUSTOM_URL,
  destinationUrl: "https://example.com",
  expiresAt: new Date("2024-12-31"),
});
```

### Fetching QR Codes
```typescript
const { qrCodes, fetchQRCodes, isLoading } = useQRCode();

useEffect(() => {
  fetchQRCodes();
}, []);
```

### Rotating Link
```typescript
const { rotateLink } = useQRCode();

await rotateLink(qrCodeId, {
  destinationUrl: "https://new-url.com",
});
```

## Component Hierarchy

```
dashboard/qrcodes
├── QRCodesPage (page.tsx)
│   ├── CreateQRCodeModal
│   ├── RotateLinkModal
│   ├── ConfirmDialog
│   └── QRCodeCard (multiple)
│       ├── Rotate Link Button
│       ├── Disable Button
│       └── Delete Button
└── QRCodeDetailPage ([id]/page.tsx)
    ├── RotateLinkModal
    ├── ConfirmDialog
    └── Analytics Display
```

## State Management

Uses custom `useQRCode` hook for centralized state management:

```typescript
{
  qrCodes: QRCodeResponseData[]
  isLoading: boolean
  error: string | null
  fetchQRCodes: () => Promise<void>
  createQRCode: (data: CreateQRCodeData) => Promise<QRCodeResponseData>
  getQRCode: (id: string) => Promise<QRCodeResponseData>
  updateQRCode: (id: string, data: UpdateQRCodeData) => Promise<QRCodeResponseData>
  rotateLink: (id: string, data: RotateLinkData) => Promise<QRCodeResponseData>
  disableQRCode: (id: string) => Promise<QRCodeResponseData>
  deleteQRCode: (id: string) => Promise<void>
  clearError: () => void
}
```

## Error Handling

- Form validation with user-friendly error messages
- API error handling with retry logic
- Success/error toast notifications
- Confirmation dialogs for destructive actions

## UI/UX Features

- **Loading States**: Disabled buttons and loading spinners during operations
- **Empty States**: Helpful messaging when no QR codes exist
- **Status Indicators**: Visual badges for QR code status
- **Real-time Updates**: List updates immediately after operations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: Proper labels, semantic HTML, and keyboard support

## Future Enhancements

1. **Bulk Operations**: Delete multiple QR codes at once
2. **Export QR Codes**: Download QR code images
3. **QR Code Editor**: Customize QR code appearance
4. **Analytics Dashboard**: Detailed analytics with charts
5. **Scheduled Expiry**: Auto-disable QR codes at set time
6. **QR Code Groups**: Organize QR codes into categories
7. **API Key Management**: Allow users to manage API keys
8. **Webhook Support**: Send scan events to external services

## Technical Details

### Technologies Used
- **React 18+**: UI framework
- **Next.js 14+**: React framework with file-based routing
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Custom Hooks**: State management
- **API Integration**: Fetch API with custom wrapper

### Best Practices Implemented
- ✅ Separation of concerns (service, hook, component)
- ✅ Type safety with TypeScript
- ✅ Error boundary and error handling
- ✅ Loading and success states
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Clean code structure
- ✅ Reusable components and hooks
