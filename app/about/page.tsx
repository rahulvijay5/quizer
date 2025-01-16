'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GithubIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">About SAP Quiz Platform</h1>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>

      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">What is SAP Quiz Platform?</h2>
          <p className="text-muted-foreground mb-4">
            SAP Quiz Platform is an open-source application designed to help SAP professionals and enthusiasts test and improve their knowledge. The platform offers a comprehensive collection of questions covering various SAP topics, from data types to views and domains.
          </p>
          <p className="text-muted-foreground">
            Whether you're preparing for certification or just want to brush up on your SAP knowledge, this platform provides an interactive way to learn and practice.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Topic-wise quizzes with randomized questions</li>
            <li>Complete test mode covering all topics</li>
            <li>Question modification and resource management</li>
            <li>Progress tracking and quiz history</li>
            <li>Dark mode support</li>
            <li>Keyboard shortcuts for efficient navigation</li>
            <li>Doubt marking system for difficult questions</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Contribute</h2>
          <p className="text-muted-foreground mb-4">
            This is an open-source project, and we welcome contributions from the community. Whether it's adding new questions, improving the UI, or fixing bugs, your help is valuable.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/rahulvijay5/quizer" target="_blank">
              <Button>
                <GithubIcon className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 gap-4 text-muted-foreground">
            <div>
              <p><kbd className="px-2 py-1 bg-muted rounded">←</kbd> Previous question</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">→</kbd> Next question</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> Save answer</p>
            </div>
            <div>
              <p><kbd className="px-2 py-1 bg-muted rounded">D</kbd> Toggle doubt</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">T</kbd> Switch answer type</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">1-6</kbd> Select option</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}