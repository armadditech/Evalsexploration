# AI Evals Tutorial - Web App

Interactive web application for learning how to build AI evaluations.

## Features

### 🎓 Tutorial
- Step-by-step lessons on eval fundamentals
- Interactive content with progress tracking
- 3 comprehensive modules covering basics to advanced

### 💻 Playground
- Live code editor with TypeScript syntax highlighting
- Run evals in real-time
- See detailed results and metrics
- Build and test your own evals

### 📋 Examples
- 4 complete working examples
- From beginner to advanced
- Code samples with explanations
- Real results and key learnings

### 📚 Documentation
- Comprehensive guides
- Scorer selection help
- Best practices
- Production deployment tips

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editing
- **React Icons** - UI icons

## Project Structure

```
web-app/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Main page
│   │   └── globals.css   # Global styles
│   └── components/       # React components
│       ├── Sidebar.tsx   # Navigation sidebar
│       ├── TutorialContent.tsx
│       ├── Playground.tsx
│       ├── Examples.tsx
│       └── Docs.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Features

### Tutorial Mode
- 3 progressive tutorials
- 9 sections total
- Progress tracking
- Code examples inline

### Playground
- Monaco code editor
- Real-time eval execution
- Results visualization
- Error handling

### Examples Browser
- 4 complete examples
- Difficulty levels
- Code + results
- Key learnings

### Documentation
- Getting started guide
- Scorer reference
- Best practices
- Production tips

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t evals-tutorial .

# Run container
docker run -p 3000:3000 evals-tutorial
```

### Manual

```bash
npm run build
npm start
```

## Environment Variables

- `ANTHROPIC_API_KEY` - Required for playground functionality

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

## License

MIT - See [LICENSE](../LICENSE) in the root directory.
