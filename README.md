# Figma to React Component Generator

This project automatically generates React components from Figma designs, complete with TypeScript types, Tailwind CSS styling, and Storybook documentation.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- A Figma account and access token
- A Figma file ID

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Storybook
- Radix UI

## Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Figma API Configuration
FIGMA_ACCESS_TOKEN=your_figma_access_token
FIGMA_FILE_ID=your_figma_file_id

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

To get your Figma access token:
1. Log in to Figma
2. Go to Settings > Account > Personal access tokens
3. Click "Generate new token"

To get your Figma file ID:
1. Open your Figma file
2. The ID is in the URL: figma.com/file/[FILE_ID]/...

### 2. Installation

```bash
# Install dependencies
npm install

# Set up Tailwind CSS
npx tailwindcss init -p
```

### 3. Directory Structure

```
src/
├── assets/        # Downloaded Figma assets
│   ├── icons/     # SVG icons from Figma
│   └── images/    # Other images from Figma
├── components/    # React components
│   ├── ui/        # Base UI components
│   ├── layout/    # Layout components
│   └── navigation/# Navigation components
└── styles/        # Global styles and theme
```

## Figma Integration Workflow

### 1. Asset Fetching Configuration

The project uses two main approaches for Figma integration:

1. **Figmagic** for design tokens and basic components:
```json
// figmagic.json
{
  "token": "${FIGMA_ACCESS_TOKEN}",
  "fileId": "${FIGMA_FILE_ID}",
  "outputFolderTokens": "src/tokens",
  "outputFolderGraphics": "src/assets",
  "outputFormatGraphics": "svg",
  "syncElements": true
}
```

2. **Custom Script** for advanced component generation:
```bash
npm run fetch-assets
```

### 2. Component Generation Process

1. **Design Token Extraction**
   - Colors, typography, spacing, and other design tokens
   - Automatically generates TypeScript types
   - Creates a theme configuration file

2. **Asset Generation**
   - SVG icons are optimized and converted to React components
   - Images are properly sized and formatted
   - Assets are organized by type and usage

3. **Component Template System**
   ```typescript
   // templates/react.tsx
   interface COMPONENT_NAMEProps {
     className?: string;
     children?: React.ReactNode;
   }
   ```

### 3. Storybook Integration

#### Setup and Configuration

1. **Main Configuration**
```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-styling'
  ],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        '@': require('path').resolve(__dirname, '../src'),
      };
    }
    return config;
  }
};
```

2. **Preview Configuration**
```typescript
// .storybook/preview.tsx
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F5F5F5' },
        { name: 'dark', value: '#1A1A1A' }
      ]
    }
  }
};
```

#### Troubleshooting Common Issues

1. **Component Not Found Errors**
   - Ensure proper export in component index files
   - Check import paths use `@/` alias
   - Verify component is properly exported

2. **Styling Issues**
   - Confirm globals.css is imported in preview
   - Check Tailwind configuration
   - Verify PostCSS setup

3. **Story Loading Failures**
   - Clear Storybook cache: `rm -rf node_modules/.cache/storybook`
   - Rebuild: `npm run build-storybook`
   - Check story format matches latest Storybook version

## Development Workflow

### 1. Component Development

```bash
# Generate new component
npm run generate-component ComponentName

# Update from Figma
npm run fetch-assets

# Test in Storybook
npm run storybook
```

### 2. Testing Components

1. **Visual Testing**
   - Use Storybook's visual testing features
   - Compare against Figma designs
   - Test responsive behavior

2. **Interactive Testing**
   - Test all component variants
   - Verify prop combinations
   - Check accessibility

### 3. Quality Checks

```bash
# Run all checks
npm run validate

# Individual checks
npm run lint
npm run type-check
npm run test
```

## Best Practices

### 1. Component Structure
- Keep components small and focused
- Use composition over inheritance
- Implement proper TypeScript interfaces
- Follow atomic design principles

### 2. Styling
- Use Tailwind utility classes
- Maintain consistent spacing
- Follow design token usage
- Implement responsive design

### 3. Performance
- Optimize asset loading
- Use proper image formats
- Implement code splitting
- Monitor bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License

