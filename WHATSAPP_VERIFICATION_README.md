# WhatsApp Verification for Upload Dress Feature

## Overview

This implementation adds WhatsApp number verification requirement for users who want to upload dresses. Users must verify their WhatsApp number before they can access the dress upload functionality.

## Files Created/Modified

### New Files:

1. `/app/verify-whatsapp/page.tsx` - WhatsApp verification page
2. `/lib/whatsapp-utils.ts` - Utility functions for WhatsApp verification

### Modified Files:

1. `/components/navbar.tsx` - Updated Upload Dress button logic
2. `/components/mobile-bottom-nav.tsx` - Updated mobile upload button logic
3. `/app/dashboard/dress/create/page.tsx` - Added verification check on page access

## How It Works

1. **Initial Check**: When user clicks "Upload Dress" button (desktop or mobile), the system checks `localStorage` for `loginUser` key.

2. **Verification Status**: The system looks for `isWhatsAppVerified: true` in the user data.

3. **Flow**:

   - If `isWhatsAppVerified: true` → User is redirected to `/dashboard/dress/create`
   - If `isWhatsAppVerified: false` or not set → User is redirected to `/verify-whatsapp`

4. **Verification Process**:
   - User enters WhatsApp number
   - System calls `/user/send-whatsapp-otp` API
   - User receives OTP on WhatsApp
   - User enters OTP
   - System calls `/user/verify-whatsapp-otp` API
   - On successful verification, `isWhatsAppVerified` is set to `true` in localStorage
   - User is redirected to `/dashboard/dress/create`

## API Endpoints Used

- `POST /user/send-whatsapp-otp` - Send OTP to WhatsApp number
- `POST /user/verify-whatsapp-otp` - Verify OTP and confirm number

## Local Storage Structure

```json
{
  "loginUser": {
    // ... other user data
    "isWhatsAppVerified": true // or false
  }
}
```

## Features

- **Timer for OTP Resend**: 60-second countdown before allowing OTP resend
- **Error Handling**: Proper error messages for API failures
- **Phone Number Change**: Users can change phone number during verification
- **Auto-redirect**: Verified users are automatically redirected
- **Protection**: Direct access to upload page is blocked for unverified users

## UI Components

- Clean, responsive verification form
- Loading states for API calls
- Success/error notifications using notistack
- OTP input with number-only validation
- Resend OTP functionality with timer

## Security

- JWT token authentication for API calls
- Client-side verification status stored in localStorage
- Server-side verification required for API endpoints
