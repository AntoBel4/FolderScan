# FolderScope AI - Example Run

This document demonstrates how to use FolderScope AI end-to-end.

## Setup

```bash
# Clone the repository
git clone https://github.com/AntoBel4/FolderScan.git
cd FolderScan

# Install dependencies
npm install

# Build the project
npm run build

# Run tests to verify everything works
npm test
```

## Basic Usage

### 1. Scan a Folder

```bash
# Scan the current directory
npm start scan .

# Scan with dry-run (no output files written)
npm start scan . --dry-run

# Scan specific folder
npm start scan ./src

# Scan with specific output directory
npm start scan . --output-dir ./reports

# Exclude certain patterns
npm start scan . --exclude "node_modules" --exclude "dist"
```

Expected output:
```
Scanned 150 items in .
Generated report: ./output/folderscope-report.md
```

### 2. Generate Reports

After scanning, generate formatted reports:

```bash
# Generate markdown report
npm start export --format md --output-dir ./reports

# Generate JSON report
npm start export --format json --output-dir ./reports
```

### 3. Compare Directories

Compare two folder structures:

```bash
npm start compare ./src ./dist

# Output shows differences and similarities
```

## Docker Usage

### Run in Docker

```bash
# Build image
docker build -f docker/Dockerfile -t folderscope:latest .

# Run scan in container
docker run -v $(pwd):/workspace folderscope:latest scan /workspace

# Run with environment variable
docker run -e AI_KEY=sk-... -v $(pwd):/workspace folderscope:latest scan /workspace
```

### Docker Compose Development

```bash
# Start development service
docker-compose -f docker/docker-compose.yml up folderscope

# Run linting
docker-compose -f docker/docker-compose.yml up lint

# Run tests
docker-compose -f docker/docker-compose.yml up test

# Clean up
docker-compose -f docker/docker-compose.yml down
```

## Configuration Example

Create `.folderscope.json`:

```json
{
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "sk-..."
  },
  "scanner": {
    "exclude": ["node_modules", ".git", "dist", "*.log"],
    "concurrency": 4,
    "cacheEnabled": true
  },
  "output": {
    "dir": "./folderscope-output",
    "format": "md"
  }
}
```

Then run:
```bash
npm start scan . --config .folderscope.json
```

## Advanced Examples

### 1. Scan with AI Analysis

```bash
export AI_KEY=sk-...
npm start scan ./documentation --output-dir ./ai-analysis
```

The CLI will:
1. Scan all files in `./documentation`
2. Extract text from various file types
3. Process chunks through AI
4. Generate analyzed report with AI insights

### 2. Batch Processing

```bash
# Create script: process-folders.sh
#!/bin/bash
for folder in ./projects/*/; do
  dirname=$(basename "$folder")
  npm start scan "$folder" --output-dir "./reports/$dirname"
done

chmod +x process-folders.sh
./process-folders.sh
```

### 3. CI/CD Integration

GitHub Actions automatically runs on every push:

```yaml
# Automatic checks
- npm ci
- npm run lint
- npm run build
- npm test
```

View workflow at `.github/workflows/ci.yml`

## Output Examples

### Markdown Report

```markdown
# Documentation

## Statistics

- Files: 47
- Total Size: 2.3 MB
- Average Size: 49 KB

## Files

- `README.md` (5.2 KB)
- `CONTRIBUTING.md` (3.1 KB)
- `API.md` (8.9 KB)
```

### JSON Export

```json
{
  "folderPath": "./documentation",
  "scanDate": "2026-04-16T23:00:00Z",
  "fileCount": 47,
  "totalSize": 2415000,
  "files": [
    {
      "path": "README.md",
      "size": 5324,
      "mtime": "2026-04-16T22:30:00Z",
      "hash": "abc123..."
    }
  ]
}
```

## Troubleshooting

### Build Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Docker Permission Issues

```bash
# Use sudo for Docker commands
sudo docker build -f docker/Dockerfile -t folderscope .

# Or add user to docker group
sudo usermod -aG docker $USER
```

### Cache Issues

```bash
# Clear cache
rm -rf .folderscope/cache.json

# Then re-scan
npm start scan .
```

### AI Integration Issues

```bash
# Verify API key is set
echo $AI_KEY

# Test with mock mode (no API key needed)
npm start scan . --dry-run

# If API integration fails, check error logs
npm start scan . 2>&1 | tee scan.log
```

## Performance Tips

1. **Use caching**: Leave `cacheEnabled: true` in config
2. **Increase concurrency**: Set `concurrency: 8` for large projects
3. **Exclude unnecessary folders**: Filter out `node_modules`, `.git`, etc.
4. **Use dry-run first**: Test before writing files
5. **Run in Docker**: Better isolation and resource management

## Next Steps

- Check the [README](./README.md) for full documentation
- Review the [API Reference](./src/README.md) for code examples
- Explore test cases in `tests/` for usage patterns
- Contribute improvements via pull requests