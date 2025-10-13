# CV Builder

A modern, AI-powered CV/resume builder with real-time editing, multiple templates, and intelligent content analysis.

## Features

- **AI-Powered Analysis**: Get instant feedback on your CV content with industry-specific scoring
- **Multi-Language Support**: Analyze and improve CVs in English, Spanish, French, and German
- **Real-Time Editing**: Live preview with autosave functionality
- **Multiple Templates**: Choose from modern, classic, and minimal designs
- **PDF Export**: Generate professional PDFs with custom styling
- **Template Marketplace**: Browse and select from various CV templates
- **Collaborative Editing**: Work with others on the same CV in real-time

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Usage

### AI Improvement Endpoint

```typescript
POST /api/ai/improve
{
  "cvData": { /* CV content */ },
  "section": "summary" | "experience" | "skills" | "full",
  "targetRole": "Software Engineer",
  "language": "en" | "es" | "fr" | "de"  // Optional, auto-detected if not provided
}
```

### Supported Languages

- `en` - English
- `es` - Español
- `fr` - Français
- `de` - Deutsch

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # Reusable UI components
├── lib/                 # Business logic and utilities
│   ├── ai/             # AI analysis engine
│   ├── pdf/            # PDF generation
│   └── templates/      # CV templates
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── __tests__/          # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License