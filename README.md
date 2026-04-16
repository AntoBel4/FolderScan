# FolderScope AI - V1

An AI-powered folder scanner and analyzer that generates comprehensive reports about directory structures and file contents.

## Features

- **Recursive Folder Scanning**: Walk through directories and extract file metadata
- **Text Extraction**: Support for multiple file formats (TXT, MD, JSON, YAML, PDF, DOCX, Code files)
- **AI Analysis**: Mockable AI wrapper with OpenAI integration
- **Intelligent Chunking**: Break large texts into manageable chunks with overlap
- **Markdown Reports**: Generate beautiful documentation and summaries
- **Caching**: SHA256-based file caching to avoid redundant processing
- **CLI Interface**: Full-featured command-line tool with multiple options
- **Docker Support**: Easy deployment via Docker and Docker Compose
- **CI/CD**: GitHub Actions workflow for automated testing and building

## Installation

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional)
- npm or yarn

### Local Setup

```bash
git clone https://github.com/AntoBel4/FolderScan.git
cd FolderScan
npm install
npm run build
```

### Docker Setup

```bash
docker build -f docker/Dockerfile -t folderscope .
docker run -v $(pwd):/workspace folderscope scan /workspace
```

Or with Docker Compose:

```bash
docker-compose -f docker/docker-compose.yml up folderscope
```

## Usage

### CLI Commands

```bash
# Scan a folder
npm start scan <path>

# Scan with dry-run mode (no file writes)
npm start scan <path> --dry-run

# Generate report
npm start report

# Export results
npm start export --format md

# Compare two directories
npm start compare <src> <dst>

# Get help
npm start --help
```

### Development

```bash
# Start dev mode with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Docker Compose Services

```bash
# Run development container
docker-compose -f docker/docker-compose.yml up folderscope

# Run linting in container
docker-compose -f docker/docker-compose.yml up lint

# Run tests in container
docker-compose -f docker/docker-compose.yml up test
```

## Configuration

Create a `.folderscope.json` file in your project root:

```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your-api-key"
  },
  "scanner": {
    "exclude": ["node_modules", ".git", "dist"],
    "concurrency": 4,
    "cacheEnabled": true
  },
  "output": {
    "dir": "./output",
    "format": "md"
  }
}
```

## Project Structure

```
.
├── src/
│   ├── ai/              # AI wrapper, chunker, prompt manager
│   ├── cli/             # CLI commands and entry point
│   ├── core/            # Core scanner logic
│   ├── extractor/       # Text extraction for various file types
│   └── render/          # Markdown report generation
├── tests/
│   ├── ai/              # AI tests
│   ├── cli/             # CLI tests
│   ├── core/            # Scanner tests
│   ├── extractor/       # Extractor tests
│   ├── fixtures/        # Test fixtures
│   └── render/          # Renderer tests
├── docker/
│   ├── Dockerfile       # Multi-stage production build
│   └── docker-compose.yml # Development services
└── .github/workflows/   # CI/CD workflows
```

## Testing

All features are covered by unit tests:

```bash
npm test               # Run all tests
npm test -- --watch   # Run in watch mode
npm test -- --coverage # Generate coverage report
```

## CI/CD Pipeline

GitHub Actions automatically:
- Installs dependencies
- Lints the code
- Builds the project
- Runs test suite
- Uploads coverage reports

See `.github/workflows/ci.yml` for details.

## API Reference

### Interfaces & Classes

- `Scanner`: Recursive directory walker with caching
- `AIClient`: Mockable AI wrapper (mock mode when `AI_KEY` env var is absent)
- `Chunker`: Text splitter with configurable overlap
- `PromptManager`: Template formatter with JSON validation/repair
- `MarkdownRenderer`: Report generator for folder structures
- `extractText`: Multi-format text extractor

## Environment Variables

- `AI_KEY`: OpenAI API key (optional, defaults to mock mode)
- `NODE_ENV`: Environment mode (development/production)

## Performance

- **Caching**: SHA256-based cache in `.folderscope/cache.json` skips unchanged files
- **Concurrency**: Configurable worker concurrency for parallel scanning
- **Chunking**: Overlapping chunks for context preservation in AI analysis

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Support

For issues or questions, open a GitHub issue on the repository.
