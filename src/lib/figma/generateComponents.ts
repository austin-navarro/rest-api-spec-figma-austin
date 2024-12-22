import { promises as fs } from 'fs';
import path from 'path';
import { loadFigmaData, type FigmaData } from './saveFigmaData';
import { createSafeId } from '../utils';

if (!process.env.FIGMA_FILE_ID) {
  throw new Error('Missing FIGMA_FILE_ID environment variable');
}

const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles?: Record<string, {
    name: string;
    description: string;
    styleType: string;
  }>;
  children?: FigmaNode[];
  constraints?: {
    horizontal: string;
    vertical: string;
  };
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  fills?: Array<{
    type: string;
    imageRef?: string;
    scaleMode?: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }>;
  strokes?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }>;
  effects?: Array<{
    type: string;
    radius?: number;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }>;
}

function sanitizeComponentName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[a-z]/, (letter) => letter.toUpperCase());
}

function generateImageStyles(node: FigmaNode): string[] {
  const styles: string[] = [];

  if (node.fills?.length) {
    const imageFill = node.fills.find(fill => fill.type === 'IMAGE');
    if (imageFill?.imageRef) {
      styles.push('bg-cover bg-center bg-no-repeat');
      if (imageFill.scaleMode === 'FIT') {
        styles.push('object-contain');
      } else {
        styles.push('object-cover');
      }
    }
  }

  return styles;
}

function generateResponsiveStyles(node: FigmaNode): string[] {
  const styles: string[] = ['relative'];

  // Add image styles if present
  styles.push(...generateImageStyles(node));

  // Base container styles
  if (node.layoutMode === 'VERTICAL') {
    styles.push('flex flex-col');
  } else if (node.layoutMode === 'HORIZONTAL') {
    styles.push('flex flex-row');
  }

  // Spacing and padding
  if (node.itemSpacing) {
    const spacing = Math.round(node.itemSpacing / 4) * 4;
    styles.push(node.layoutMode === 'VERTICAL' ? `space-y-[${spacing}px]` : `space-x-[${spacing}px]`);
  }

  const padding = {
    top: node.paddingTop && Math.round(node.paddingTop / 4) * 4,
    right: node.paddingRight && Math.round(node.paddingRight / 4) * 4,
    bottom: node.paddingBottom && Math.round(node.paddingBottom / 4) * 4,
    left: node.paddingLeft && Math.round(node.paddingLeft / 4) * 4,
  };

  if (Object.values(padding).some(Boolean)) {
    const paddings = [];
    if (padding.top === padding.bottom && padding.left === padding.right && padding.top === padding.left) {
      paddings.push(`p-[${padding.top}px]`);
    } else {
      if (padding.top) paddings.push(`pt-[${padding.top}px]`);
      if (padding.right) paddings.push(`pr-[${padding.right}px]`);
      if (padding.bottom) paddings.push(`pb-[${padding.bottom}px]`);
      if (padding.left) paddings.push(`pl-[${padding.left}px]`);
    }
    styles.push(...paddings);
  }

  // Size constraints
  if (node.absoluteBoundingBox) {
    const { width, height } = node.absoluteBoundingBox;
    
    // Make sizes responsive
    if (width > 768) {
      styles.push('w-full max-w-[1200px] mx-auto');
    } else {
      styles.push(`max-w-[${width}px]`);
    }

    if (height > 0) {
      styles.push(`min-h-[${height}px]`);
    }
  }

  // Visual styles
  if (node.fills?.length) {
    const fill = node.fills[0];
    if (fill.color) {
      const { r, g, b, a } = fill.color;
      const rgb = `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`;
      styles.push(`bg-[rgb(${rgb})]`);
      if (a < 1) styles.push(`bg-opacity-[${Math.round(a * 100)}]`);
    }
  }

  if (node.strokes?.length) {
    styles.push('border');
    const stroke = node.strokes[0];
    if (stroke.color) {
      const { r, g, b, a } = stroke.color;
      const rgb = `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`;
      styles.push(`border-[rgb(${rgb})]`);
      if (a < 1) styles.push(`border-opacity-[${Math.round(a * 100)}]`);
    }
  }

  if (node.effects?.length) {
    node.effects.forEach(effect => {
      if (effect.type === 'DROP_SHADOW' && effect.radius) {
        styles.push(`shadow-lg`);
      }
    });
  }

  return styles;
}

function generateComponentCode(node: FigmaNode): string {
  const componentName = sanitizeComponentName(node.name);
  const styles = generateResponsiveStyles(node);
  const hasImage = node.fills?.some(fill => fill.type === 'IMAGE');

  let imageJSX = '';
  if (hasImage) {
    const imageFill = node.fills?.find(fill => fill.type === 'IMAGE');
    if (imageFill?.imageRef) {
      imageJSX = `
        <Image
          src={\`/assets/figma/\${props.imageId || '${node.id}'}.png\`}
          alt={\`${componentName} image\`}
          fill
          className="object-cover"
          priority
        />`;
    }
  }

  return `import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  imageId?: string;
}

const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, children, variant = 'default', size = 'md', imageId = '${node.id}', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "${styles.join(' ')}",
          // Variant styles
          variant === 'outline' && "border-2",
          variant === 'ghost' && "hover:bg-muted/50",
          // Size styles
          size === 'sm' && "min-h-[150px] p-2",
          size === 'md' && "min-h-[200px] p-4",
          size === 'lg' && "min-h-[300px] p-6",
          // Custom classes
          className
        )}
        {...props}
      >
        ${hasImage ? imageJSX : ''}
        {children || (
          <div className="relative flex h-full w-full items-center justify-center">
            <span className="text-sm text-muted-foreground">
              ${componentName} Component
            </span>
          </div>
        )}
      </div>
    );
  }
);

${componentName}.displayName = "${componentName}";

export { ${componentName} };`;
}

export async function generateComponents(): Promise<void> {
  try {
    // Load Figma data
    const figmaData = await loadFigmaData(FIGMA_FILE_ID);
    
    // Create components directory
    const componentsDir = path.join(process.cwd(), 'src', 'components', 'generated');
    await fs.mkdir(componentsDir, { recursive: true });

    // Keep track of generated components
    const generatedComponents: string[] = [];

    // Process nodes
    async function processNode(node: FigmaNode) {
      if (node.type === 'COMPONENT') {
        const componentName = sanitizeComponentName(node.name);
        const componentCode = generateComponentCode(node);

        const componentPath = path.join(componentsDir, `${componentName}.tsx`);
        await fs.writeFile(componentPath, componentCode);
        generatedComponents.push(componentName);

        console.log(`Generated component: ${componentName}`);
      }

      if (node.children) {
        for (const child of node.children) {
          await processNode(child);
        }
      }
    }

    // Process all nodes
    for (const node of figmaData.document.children) {
      await processNode(node);
    }

    // Generate index file
    const indexContent = generatedComponents
      .map(name => `export { ${name} } from './${name}';`)
      .join('\n');
    
    await fs.writeFile(
      path.join(componentsDir, 'index.ts'),
      indexContent
    );

    console.log('Component generation complete!');
  } catch (error) {
    console.error('Error generating components:', error);
    throw error;
  }
} 