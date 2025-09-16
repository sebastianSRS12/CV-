# CV Builder Pro - Setup Guide

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL** - [Download here](https://www.postgresql.org/download/) or use cloud service
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install main dependencies
npm install

# Install missing UI dependencies
npm install clsx tailwind-merge

# Install NextAuth Prisma adapter
npm install @next-auth/prisma-adapter
```

### 2. Environment Setup

```bash
# Copy the environment template
copy env.template .env

# Edit .env file with your actual values
# See env.template for detailed instructions
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Optional: Seed database with sample data
npx prisma db seed
```

### 4. OAuth Setup (Google)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`
6. Add redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Secret to `.env` file

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Database commands
npx prisma studio          # Open database browser
npx prisma migrate reset   # Reset database
npx prisma db push         # Push schema changes
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cv/                # CV management pages
│   ├── dashboard/         # User dashboard
│   └── templates/         # Template selection
├── components/            # Reusable components
│   ├── ui/                # Base UI components
│   └── error-boundary.tsx # Error handling
├── features/              # Feature modules
│   ├── auth/              # Authentication feature
│   └── cv/                # CV builder feature
├── lib/                   # Utilities and configs
│   ├── api/               # API clients
│   ├── hooks/             # Custom React hooks
│   ├── templates/         # CV templates
│   └── utils/             # Helper functions
├── providers/             # Context providers
└── types/                 # TypeScript definitions
```

## 🔐 Authentication Flow

1. User clicks "Sign In"
2. Redirected to `/auth/signin`
3. OAuth provider authentication
4. Callback to `/api/auth/callback/[provider]`
5. Session created and stored
6. Redirected to `/dashboard`

## 📝 CV Builder Flow

1. User selects template from `/templates`
2. New CV created with template structure
3. Redirected to `/cv/[id]/edit`
4. Real-time editing with auto-save
5. Preview updates automatically
6. Export options available

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
pg_ctl status

# Verify DATABASE_URL in .env
# Format: postgresql://user:password@localhost:5432/dbname
```

**OAuth Errors**
- Verify Google OAuth credentials
- Check authorized origins and redirect URIs
- Ensure NEXTAUTH_SECRET is set

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Regenerate Prisma client
npx prisma generate

# Check for missing type definitions
npm install @types/node @types/react @types/react-dom
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes and add tests
4. Run linting: `npm run lint`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature/name`
7. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.
