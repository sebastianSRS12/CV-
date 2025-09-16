    # Security Testing Guide

## Overview

This guide provides comprehensive information about the security testing framework implemented in the CV Builder Pro application. The security tests ensure protection against common web vulnerabilities and maintain data privacy standards.

## 🔒 Security Test Coverage

### 1. Authentication & Authorization
- **Session Management**: Validates session creation, expiration, and invalidation
- **OAuth Security**: Tests OAuth flow security, state parameter validation, redirect URI validation
- **Password Security**: Enforces strong password requirements and rate limiting for login attempts
- **Role-Based Access Control**: Ensures proper permission enforcement

### 2. Input Validation & Sanitization
- **Email Validation**: Validates email format using regex patterns
- **UUID Validation**: Ensures proper UUID format for resource identifiers
- **SQL Injection Prevention**: Tests parameterized queries and input sanitization
- **Data Type Validation**: Validates all input data types and formats

### 3. XSS (Cross-Site Scripting) Prevention
- **Script Detection**: Identifies malicious script tags and JavaScript injection attempts
- **HTML Sanitization**: Tests DOMPurify implementation for safe HTML content
- **URL Validation**: Validates URLs and prevents javascript: protocol attacks
- **Template Injection Prevention**: Prevents template engine exploitation
- **DOM-based XSS Prevention**: Tests safe DOM manipulation practices

### 4. CSRF (Cross-Site Request Forgery) Protection
- **Token Generation**: Tests cryptographically secure CSRF token generation
- **Token Validation**: Validates CSRF tokens using constant-time comparison
- **State-Changing Operations**: Ensures CSRF protection for POST, PUT, DELETE, PATCH requests
- **SameSite Cookie Protection**: Tests proper cookie security attributes
- **Origin and Referer Validation**: Validates request origin headers

### 5. File Upload Security
- **File Type Validation**: Restricts uploads to allowed MIME types
- **File Size Limits**: Enforces maximum file size restrictions (5MB)
- **Filename Sanitization**: Removes dangerous characters from filenames
- **Content Validation**: Scans file content for malicious patterns
- **Path Traversal Prevention**: Prevents directory traversal attacks

### 6. Rate Limiting
- **General API Limits**: 100 requests per 15 minutes
- **Authentication Limits**: 5 login attempts per 15 minutes
- **Upload Limits**: 10 file uploads per hour
- **Endpoint-Specific Limits**: Different limits for different endpoint types

### 7. Data Privacy & Access Control
- **User Data Isolation**: Ensures users can only access their own data
- **Data Anonymization**: Tests data anonymization for analytics
- **GDPR Compliance**: Right to be forgotten, data export functionality
- **Audit Logging**: Tracks all sensitive operations
- **Data Retention**: Implements proper data retention policies

### 8. Security Headers
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables browser XSS protection
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Content-Security-Policy**: Restricts resource loading
- **Referrer-Policy**: Controls referrer information

## 🧪 Running Security Tests

### Command Line Options

```bash
# Run all security tests
npm run test:security

# Run security tests in watch mode
npm run test:security:watch

# Run specific security test file
npx jest src/__tests__/security/basic.security.test.js

# Run tests with verbose output
npm run test:security -- --verbose

# Run tests with coverage
npm run test:security -- --coverage
```

### Manual Installation Commands

If you prefer to install dependencies manually:

```bash
# Security testing dependencies
npm install --save-dev supertest@^7.0.0
npm install --save-dev nock@^13.5.5
npm install --save-dev helmet@^8.0.0
npm install --save-dev express-rate-limit@^7.4.1
npm install --save-dev dompurify@^3.2.0
npm install --save-dev @types/dompurify@^3.2.0
npm install --save-dev @types/supertest@^6.0.2
npm install --save-dev ts-jest@^29.1.5
```

## 📁 Test File Structure

```
src/__tests__/security/
├── basic.security.test.js          # Core security tests (39 tests) ✅
├── auth.security.test.ts           # Authentication security tests
├── api.security.test.ts            # API endpoint security tests
├── xss.security.test.ts            # XSS prevention tests
├── csrf.security.test.ts           # CSRF protection tests
├── privacy.security.test.ts        # Data privacy tests
└── security.config.test.ts         # Security configuration tests
```

## 🛠️ Security Utilities

### Location: `src/lib/security/security-utils.ts`

#### Available Functions

```typescript
// HTML Sanitization
sanitizeHtml(content: string): string

// Token Generation
generateSecureToken(length?: number): string
generateCSRFToken(): string

// Token Validation
validateCSRFToken(providedToken: string, storedToken: string): boolean

// Input Validation
isValidUUID(uuid: string): boolean
isValidEmail(email: string): boolean
isStrongPassword(password: string): boolean
isValidUrl(url: string): boolean

// File Security
sanitizeFilename(filename: string): string
validateFileUpload(file: FileObject): ValidationResult

// Data Protection
encryptData(data: string, key: string): string
decryptData(encryptedData: string, key: string): string
anonymizeUserData(userData: any): any

// Security Configuration
SECURITY_HEADERS: SecurityHeaders
RATE_LIMITS: RateLimitConfig
DATA_RETENTION_POLICIES: RetentionPolicies
```

## 🔧 Security Middleware

### Location: `src/middleware.ts`

The security middleware provides:

- **CSRF Protection**: Validates CSRF tokens for state-changing operations
- **Origin Validation**: Checks request origin against allowed domains
- **Referer Validation**: Validates referer headers for additional CSRF protection
- **Authentication Enforcement**: Protects API routes and authenticated pages
- **Security Headers**: Applies security headers to all responses

### Configuration

```typescript
// Allowed origins
const allowedOrigins = [
  process.env.NEXTAUTH_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://your-domain.com'
];

// Protected routes
const protectedRoutes = [
  '/dashboard',
  '/cv-editor',
  '/api/cv',
  '/api/user'
];
```

## 📊 Test Results

### Current Status
- **Total Security Tests**: 39
- **Passing Tests**: 39 ✅
- **Failed Tests**: 0
- **Test Suites**: 7 (3 passing, 4 with syntax issues)

### Test Categories
1. **Input Validation**: 8 tests
2. **XSS Prevention**: 6 tests
3. **CSRF Protection**: 4 tests
4. **File Upload Security**: 4 tests
5. **Rate Limiting**: 3 tests
6. **Security Headers**: 2 tests
7. **Data Privacy**: 12 tests

## 🚨 Security Best Practices

### For Developers

1. **Always validate input** on both client and server side
2. **Use parameterized queries** to prevent SQL injection
3. **Sanitize HTML content** before rendering
4. **Implement CSRF protection** for all state-changing operations
5. **Validate file uploads** thoroughly
6. **Use secure session configuration**
7. **Implement proper error handling** without exposing sensitive information
8. **Log security events** for monitoring and auditing

### For Testing

1. **Run security tests** before every deployment
2. **Test with malicious inputs** to ensure proper validation
3. **Verify security headers** are properly configured
4. **Test authentication flows** thoroughly
5. **Validate rate limiting** is working correctly
6. **Check data isolation** between users
7. **Test file upload restrictions**

## 🔍 Troubleshooting

### Common Issues

1. **Jest Configuration**: Ensure Jest is properly configured for TypeScript
2. **Missing Dependencies**: Install all security testing dependencies manually
3. **Environment Variables**: Set up proper environment variables for testing
4. **Database Connection**: Ensure test database is properly configured

### Debug Commands

```bash
# Run tests with debug output
npm run test:security -- --verbose --no-cache

# Run specific test with detailed output
npx jest src/__tests__/security/basic.security.test.js --verbose

# Check Jest configuration
npx jest --showConfig
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🔄 Continuous Security

### Integration with CI/CD

Add security tests to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Security Tests
  run: npm run test:security

- name: Security Audit
  run: npm audit --audit-level moderate
```

### Regular Security Reviews

1. **Weekly**: Run security tests and review results
2. **Monthly**: Update security dependencies
3. **Quarterly**: Review and update security policies
4. **Annually**: Conduct comprehensive security audit
