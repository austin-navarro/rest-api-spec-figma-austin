import * as React from "react"
import { Metadata } from "next"
import * as Components from "@/components/generated"

export const metadata: Metadata = {
  title: "Figma Components Demo",
  description: "Interactive demo of components generated from Figma",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome</h1>
    </main>
  );
} 