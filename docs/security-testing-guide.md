# Security Testing Guide

## 🔒 Security Test Coverage

### Google Token Verification
- **Token Retrieval**: Ensure the client correctly obtains an ID token from Google Sign‑In.
- **Server Verification**: Verify the ID token using `google-auth-library` with checks for:
  - `iss` claim (must be `accounts.google.com` or `https://accounts.google.com`)
  - `aud` claim matches `GOOGLE_CLIENT_ID`
  - `exp` claim is in the future
- **Payload Extraction**: Confirm the server extracts `sub` (user ID) and `email` from the verified payload.
- **Error Handling**: Test invalid, expired, or tampered tokens result in proper error responses.

## Existing Test Sections
- Authentication & Authorization
- Input Validation & Sanitization
- XSS Prevention
- CSRF Protection
- File Upload Security
- Rate Limiting
- Data Privacy & Access Control
- Security Headers
- ... (other sections remain unchanged)