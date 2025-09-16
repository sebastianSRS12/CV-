# CV Builder Pro - Technical Documentation

## Project Overview
CV Builder Pro is a modern web application that allows users to create, edit, and manage professional CVs. This document serves as the central source of truth for the project's architecture, development guidelines, and implementation details.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── [all other pages]
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   └── [feature]/         # Feature-specific components
├── features/              # Feature modules
│   ├── auth/              # Authentication feature
│   └── cv/                # CV builder feature
├── lib/                   # Shared utilities
│   ├── api/               # API client
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── providers/             # Context providers
└── types/                 # TypeScript type definitions
```

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - TypeScript ORM for database
- **NextAuth.js** - Authentication
- **PostgreSQL** - Primary database
- **Zod** - Schema validation
- **React Hook Form** - Form handling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** + **React Testing Library** - Testing
- **Storybook** - Component documentation

## 🔐 Authentication

### Setup
1. Configure environment variables (see `.env.example`)
2. Set up OAuth providers (Google, GitHub, etc.)
3. Run database migrations

### Features
- Email/Password
- OAuth (Google, GitHub)
- Session management
- Protected routes

## 📝 CV Builder

### Features
- Multiple CV templates
- Real-time preview
- PDF export
- Version history
- ATS optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm

### Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Run migrations: `pnpm prisma migrate dev`
5. Start dev server: `pnpm dev`

## 🧪 Testing

### Unit & Integration Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### 🔒 Security Testing

The application includes comprehensive security tests to ensure protection against common web vulnerabilities.

#### Security Test Coverage
- **Authentication & Authorization**: Session management, OAuth security, password validation
- **Input Validation**: Email format, UUID validation, SQL injection prevention
- **XSS Prevention**: Script detection, HTML sanitization, URL validation
- **CSRF Protection**: Token validation, state-changing operation protection
- **File Upload Security**: File type/size validation, filename sanitization
- **Rate Limiting**: API endpoint protection, login attempt limiting
- **Data Privacy**: User data isolation, anonymization, access control
- **Security Headers**: HTTP security header configuration

#### Running Security Tests
```bash
# Run security tests only
npm run test:security

# Run security tests in watch mode
npm run test:security:watch

# Run specific security test file
npx jest src/__tests__/security/basic.security.test.js
```

#### Security Test Files
- `basic.security.test.js` - Core security validation tests (39 tests)
- `auth.security.test.ts` - Authentication security tests
- `api.security.test.ts` - API endpoint security tests
- `xss.security.test.ts` - XSS prevention tests
- `csrf.security.test.ts` - CSRF protection tests
- `privacy.security.test.ts` - Data privacy and access control tests
- `security.config.test.ts` - Security configuration tests

#### Security Utilities
The application includes security utility functions in `src/lib/security/security-utils.ts`:
- HTML sanitization
- Token generation and validation
- File upload validation
- Data encryption/decryption
- Input validation helpers

#### Security Middleware
Security middleware in `src/middleware.ts` provides:
- CSRF protection for state-changing operations
- Origin and referer validation
- Authentication enforcement
- Security headers application

## 🧭 Development Workflow

1. Create a new branch: `git checkout -b feature/name`
2. Make your changes
3. Write tests
4. Run linter: `pnpm lint`
5. Run tests: `pnpm test`
6. Create a pull request

## 📦 Deployment

### Production
- Vercel (recommended)
- Docker support available

### Environment Variables
See `.env.example` for required variables

## 📚 Documentation

- [Component Documentation](./docs/components.md)
- [API Reference](./docs/api.md)
- [Testing Guide](./docs/testing.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📅 Last Updated
2025-09-11

## Project Structure

```
src/
├── app/                        # App Router directory
│   ├── api/                    # API routes
│   │   └── auth/               # Authentication API routes
│   │       └── [...nextauth]/  # NextAuth.js API route
│   ├── auth/                   # Authentication pages
│   │   └── signin/             # Sign-in page
│   ├── dashboard/              # User dashboard
│   ├── components/             # Reusable components
│   │   ├── auth/               # Authentication components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utility functions and configs
│   └── providers.tsx           # Context providers
├── prisma/                     # Database schema and migrations
│   └── schema.prisma          # Prisma schema
└── styles/                     # Global styles
```

## Authentication Flow

### 1. Sign In Process
1. User clicks "Sign In" button
2. Redirected to `/auth/signin` page
3. User selects an OAuth provider (Google)
4. After successful authentication, user is redirected to `/dashboard`

### 2. Session Management
- Uses HTTP-only cookies for session storage
- JWT tokens for stateless authentication
- Session data is stored in the database via Prisma

## State Management

### 1. Authentication State
- Managed by NextAuth.js
- Accessible via the `useSession()` hook
- Persisted across page refreshes using HTTP-only cookies

### 2. UI State
- Local component state using React's `useState`
- Form state managed by React Hook Form
- Global UI state (like theme) using React Context

## Database Schema

### Models

#### User
- Stores user account information
- Related to multiple CVs
- Connected to authentication providers
Email with one pass key 


#### CV
- Represents a single CV document
- Contains JSON data for the CV content
- Belongs to a User
Give secure output to the user, also if need we can add option for email and linkedin profile 


#### Account
- Stores OAuth account information
- Used by NextAuth.js for authentication

#### Session
- Tracks user sessions
- Used by NextAuth.js for session management

## Component Documentation

### 1. Layout Components

#### Header
- Navigation bar with sign-in/sign-out functionality
- Responsive design with mobile menu
- Shows user avatar when logged in
Add light mode also on the interface 
### 2. Authentication Components

#### SignInButton
- Reusable button for OAuth sign-in
- Supports multiple providers (Google, GitHub, etc.)
- Handles the sign-in flow

### 3. Page Components

#### Dashboard
- Shows list of user's CVs
- Provides actions to create, edit, and delete CVs
- Protected route (requires authentication)

#### CV Editor
- Interactive CV editing interface
- Real-time preview
- Save/update functionality

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cvbuilder"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-goes-here"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Initiate OAuth sign-in
- `POST /api/auth/signout` - Sign out current user
- `GET /api/auth/session` - Get current session

### CV Management
- `GET /api/cv` - List user's CVs
- `POST /api/cv` - Create new CV
- `GET /api/cv/:id` - Get CV by ID
- `PUT /api/cv/:id` - Update CV
- `DELETE /api/cv/:id` - Delete CV

## Deployment

### Prerequisites
- Node.js 16.14+ and npm
- PostgreSQL database
- OAuth provider credentials

### Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (`.env`)
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Testing

Run tests with:
```bash
npm test
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT
