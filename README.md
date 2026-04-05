# LaxPNG

AI-powered legal research platform for Papua New Guinea. Search legislation, analyse contracts, chat with an AI legal assistant, and generate legal documents — all with traceable citations.

## Tech Stack

- **Backend:** Laravel 13 (PHP 8.3), MySQL
- **Frontend:** React 19, Inertia.js v3, Tailwind CSS v4, shadcn/ui
- **AI:** Laravel AI SDK (OpenAI/Anthropic)
- **Routing:** Laravel Wayfinder (typed TypeScript route generation)
- **Auth:** Laravel Fortify (email/password, two-factor authentication)
- **Testing:** Pest 4

## Features

- **AI Legal Chat** — Conversational AI grounded in PNG law with citations
- **Legal Research Search** — RAG-powered search across legislation and case law
- **Document Library** — Browse and filter PNG acts and case law
- **Document Templates** — Generate legal documents from reusable templates
- **Contract Analysis** — Upload contracts for AI-powered clause analysis and risk assessment
- **Admin Panel** — Manage users, documents, templates, and view search analytics

## Requirements

- PHP 8.3+
- Node.js 20+
- MySQL 8+
- Composer 2

## Installation

```bash
# Clone the repository
git clone <repo-url> laxpng
cd laxpng

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Configure your database in .env, then:
php artisan migrate --seed

# Build frontend assets
npm run build
```

## Development

```bash
# Start the dev server (Laravel + Vite)
composer run dev

# Or run separately:
php artisan serve
npm run dev

# Generate Wayfinder routes after adding/changing controllers
php artisan wayfinder:generate

# Run tests
php artisan test

# Format PHP code
vendor/bin/pint

# Lint & format frontend
npm run lint
npm run format
```

## Testing

```bash
# Run all tests
php artisan test

# Run with compact output
php artisan test --compact

# Filter by name
php artisan test --filter=SearchTest
```

## Project Structure

```
app/
├── Http/Controllers/       # Web & admin controllers
├── Http/Middleware/         # Role-based access, Inertia middleware
├── Models/                 # Eloquent models (User, LegalDocument, etc.)
├── Actions/                # Fortify auth actions
└── Providers/              # Service & Fortify providers

resources/js/
├── pages/                  # Inertia page components
├── components/             # Reusable React components (shadcn/ui)
├── layouts/                # App, auth, and settings layouts
├── actions/                # Wayfinder-generated controller actions
└── routes/                 # Wayfinder-generated route functions

database/
├── migrations/             # Database schema
├── factories/              # Model factories for testing
└── seeders/                # Demo data seeder

tests/
├── Feature/                # Feature tests (HTTP, integration)
└── Unit/                   # Unit tests
```

## License

MIT
