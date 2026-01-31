# QR Code Feature - Quick Start Guide

## For Developers

### File Locations
- **Services**: `src/services/qrcode.service.ts`
- **Hooks**: `src/hooks/useQRCode.ts`
- **Components**: `src/components/` and `src/components/modals/`
- **Pages**: `src/app/dashboard/qrcodes/` and `src/app/qr/`

### Quick API Reference

#### Create QR Code
```typescript
const { createQRCode, isLoading } = useQRCode();

try {
  const newQRCode = await createQRCode({
    type: "CUSTOM_URL",
    destinationUrl: "https://example.com",
    expiresAt: new Date("2024-12-31"),
  });
  console.log("Created:", newQRCode._id);
} catch (error) {
  console.error("Failed:", error);
}
```

#### Fetch All QR Codes
```typescript
const { qrCodes, fetchQRCodes, isLoading } = useQRCode();

useEffect(() => {
  fetchQRCodes();
}, []);

// qrCodes is an array of QRCodeResponseData
```

#### Update URL (Rotate Link)
```typescript
const { rotateLink } = useQRCode();

await rotateLink(qrCodeId, {
  destinationUrl: "https://new-url.com",
});
```

#### Disable QR Code
```typescript
const { disableQRCode } = useQRCode();

await disableQRCode(qrCodeId);
```

#### Delete QR Code
```typescript
const { deleteQRCode } = useQRCode();

await deleteQRCode(qrCodeId);
```

### Component Usage

#### Use QR Code Card
```tsx
import { QRCodeCard } from "@/components/QRCodeCard";

<QRCodeCard
  qrCode={qrCodeData}
  onEdit={handleEdit}
  onRotateLink={handleRotateLink}
  onDisable={handleDisable}
  onDelete={handleDelete}
  isLoading={isLoading}
/>
```

#### Use Create Modal
```tsx
import { CreateQRCodeModal } from "@/components/modals";

const [isOpen, setIsOpen] = useState(false);

<CreateQRCodeModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
  isLoading={isLoading}
/>
```

#### Use Rotate Link Modal
```tsx
import { RotateLinkModal } from "@/components/modals";

<RotateLinkModal
  isOpen={isOpen}
  onClose={handleClose}
  currentUrl={qrCode.destinationUrl}
  onSubmit={handleRotate}
  isLoading={isLoading}
/>
```

#### Use Confirm Dialog
```tsx
import { ConfirmDialog } from "@/components/modals";

<ConfirmDialog
  isOpen={isOpen}
  title="Delete QR Code?"
  message="This action cannot be undone."
  confirmText="Delete"
  isDangerous={true}
  isLoading={isLoading}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

### Enum Reference

#### QR Code Types
```typescript
enum QRCodeType {
  GOOGLE_REVIEW = "GOOGLE_REVIEW",
  CUSTOM_URL = "CUSTOM_URL",
  PRODUCT_LINK = "PRODUCT_LINK",
}
```

### Data Types

#### QRCodeResponseData
```typescript
interface QRCodeResponseData {
  _id: string;              // Unique ID
  userId: string;           // Owner's user ID
  slug: string;             // URL slug (unique)
  type: QRCodeType;         // Type of QR code
  destinationUrl: string;   // Where QR code links to
  isActive: boolean;        // Is QR code active
  expiresAt: Date | null;   // Expiry date (optional)
  qrCodeImageUrl?: string;  // QR code image URL (optional)
  scanCount: number;        // Total scans
  createdAt: Date;          // Creation date
  updatedAt: Date;          // Last update date
}
```

### Common Patterns

#### Pattern 1: Full Page with QR Codes
```tsx
"use client";

import { useEffect, useState } from "react";
import { useQRCode } from "@/hooks/useQRCode";

export default function MyQRPage() {
  const { qrCodes, isLoading, error, fetchQRCodes } = useQRCode();

  useEffect(() => {
    fetchQRCodes();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {qrCodes.map(qr => (
        <QRCodeCard key={qr._id} qrCode={qr} {...handlers} />
      ))}
    </div>
  );
}
```

#### Pattern 2: Create and List
```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
const { qrCodes, createQRCode, fetchQRCodes } = useQRCode();

const handleCreate = async (data: CreateQRCodeData) => {
  await createQRCode(data);
  setIsModalOpen(false);
  // List automatically updates via hook
};

return (
  <>
    <button onClick={() => setIsModalOpen(true)}>Create</button>
    <CreateQRCodeModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleCreate}
      isLoading={isLoading}
    />
    <div>{qrCodes.map(qr => ...)}</div>
  </>
);
```

#### Pattern 3: Detail and Edit
```tsx
const { getQRCode, rotateLink, isLoading } = useQRCode();
const [qrCode, setQRCode] = useState<QRCodeResponseData | null>(null);

useEffect(() => {
  const load = async () => {
    const data = await getQRCode(qrCodeId);
    setQRCode(data);
  };
  load();
}, [qrCodeId]);

const handleRotateLink = async (newUrl: string) => {
  const updated = await rotateLink(qrCode._id, { destinationUrl: newUrl });
  setQRCode(updated);
};

return <QRCodeDetail qrCode={qrCode} onRotateLink={handleRotateLink} />;
```

### Error Handling

```typescript
const { error, clearError } = useQRCode();

// Show error
{error && (
  <div className="alert alert-error">
    {error}
    <button onClick={clearError}>Dismiss</button>
  </div>
)}

// Or handle per operation
try {
  await createQRCode(data);
  showSuccess("QR Code created!");
} catch (err) {
  showError(err.message);
}
```

### Tips & Best Practices

1. **Always fetch on mount** - Call `fetchQRCodes()` in useEffect
2. **Handle loading states** - Disable buttons/inputs while loading
3. **Show confirmations** - Use ConfirmDialog for destructive actions
4. **Validate URLs** - Backend validates, but UI should too
5. **Handle expiry** - Show different UI for expired codes
6. **Show notifications** - Use toast/alerts for success/error
7. **Disable actions** - Disable buttons when QR is expired/inactive
8. **Copy to clipboard** - Provide easy URL sharing

### Troubleshooting

**Q: QR codes not loading?**
A: Check that:
- Authentication token is valid
- Backend `/qrcode` endpoint is responding
- User ID is correctly set in request

**Q: Modal not opening?**
A: Ensure:
- State for `isOpen` is properly managed
- `onClose` callback properly sets state to false
- Modal component is rendered

**Q: Changes not reflecting?**
A: The hook auto-updates list on mutations. If not:
- Call `fetchQRCodes()` manually to refresh
- Check network tab for API errors

**Q: Expiry date not working?**
A: Ensure date is:
- In ISO format or Date object
- In the future
- Properly formatted from form input

### Environment Variables Needed
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Dependencies
- React 18+
- Next.js 14+
- TypeScript
- Tailwind CSS (for styling)

### Testing with curl

```bash
# Create QR Code
curl -X POST http://localhost:3002/qrcode \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CUSTOM_URL",
    "destinationUrl": "https://example.com"
  }'

# List QR Codes
curl -X GET http://localhost:3002/qrcode \
  -H "Authorization: Bearer TOKEN"

# Get Single QR Code
curl -X GET http://localhost:3002/qrcode/ID \
  -H "Authorization: Bearer TOKEN"

# Rotate Link
curl -X POST http://localhost:3002/qrcode/ID/rotate-link \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destinationUrl": "https://new-url.com"}'

# Disable
curl -X POST http://localhost:3002/qrcode/ID/disable \
  -H "Authorization: Bearer TOKEN"

# Delete
curl -X DELETE http://localhost:3002/qrcode/ID \
  -H "Authorization: Bearer TOKEN"

# Scan (public)
curl -X GET http://localhost:3002/qrcode/SLUG/scan
```

---

For more details, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) and [QR_CODE_FEATURE.md](./QR_CODE_FEATURE.md)
