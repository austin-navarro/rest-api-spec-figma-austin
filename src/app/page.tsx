import * as React from "react"
import { Metadata } from "next"
import * as Components from "@/components/generated"

export const metadata: Metadata = {
  title: "Figma Components Demo",
  description: "Interactive demo of components generated from Figma",
}

export default function DemoPage() {
  const componentNames = Object.keys(Components).filter(name => 
    typeof (Components as any)[name] === 'function' && 
    name !== '__esModule'
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-xl font-bold">Figma Components Demo</h1>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid gap-8">
          {componentNames.map((name) => {
            const Component = (Components as any)[name];
            if (!Component) return null;

            return (
              <section key={name} className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">{name}</h2>
                <div className="grid gap-4">
                  {/* Default variant */}
                  <div>
                    <h3 className="mb-2 text-sm text-muted-foreground">Default</h3>
                    <Component />
                  </div>
                  
                  {/* Outline variant */}
                  <div>
                    <h3 className="mb-2 text-sm text-muted-foreground">Outline</h3>
                    <Component variant="outline" />
                  </div>
                  
                  {/* Ghost variant */}
                  <div>
                    <h3 className="mb-2 text-sm text-muted-foreground">Ghost</h3>
                    <Component variant="ghost" />
                  </div>

                  {/* Different sizes */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <h3 className="mb-2 text-sm text-muted-foreground">Small</h3>
                      <Component size="sm" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm text-muted-foreground">Medium</h3>
                      <Component size="md" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm text-muted-foreground">Large</h3>
                      <Component size="lg" />
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
} 